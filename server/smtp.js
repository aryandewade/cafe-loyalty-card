import net from 'node:net';
import tls from 'node:tls';

/**
 * Lightweight Zero-Dependency Native SMTP Client for Bun & Node.js
 * Supports Port 465 (Implicit TLS) and Port 587 (STARTTLS with RFC 3207 upgrade)
 */
export class SmtpClient {
  constructor(config = {}) {
    this.host = config.host || process.env.SMTP_HOST || 'smtp.gmail.com';
    this.port = parseInt(config.port || process.env.SMTP_PORT || '587', 10);
    this.secure = config.secure !== undefined 
      ? Boolean(config.secure) 
      : (process.env.SMTP_SECURE === 'true' || this.port === 465);
    this.user = config.user || process.env.SMTP_USER || 'aryandewade16@gmail.com';
    this.pass = (config.pass || process.env.SMTP_PASS || 'sgxfoizhobhhgoob').replace(/\s+/g, '');
    this.from = config.from || process.env.SMTP_FROM || '"Atelier Specialty Coffee" <aryandewade16@gmail.com>';
  }

  isConfigured() {
    return Boolean(this.host && this.user && this.pass);
  }

  async sendMail({ to, subject, html, text }) {
    if (!this.isConfigured()) {
      console.warn('\n⚠️ [SMTP Notice] SMTP credentials not set in .env. Falling back to Dev Console mode.');
      console.log(`✉️ [DEV EMAIL SIMULATOR]`);
      console.log(`   To:      ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Text:\n${text || html}\n`);
      return { success: true, simulated: true };
    }

    const boundary = '----=_Part_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    const messageLines = [
      `From: ${this.from}`,
      `To: ${to}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
      `MIME-Version: 1.0`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${Date.now()}.${Math.random().toString(36).substring(2)}@atelier-coffee.com>`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      '',
      text || html.replace(/<[^>]+>/g, ''),
      '',
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      '',
      html,
      '',
      `--${boundary}--`,
      ''
    ];

    const messageData = messageLines.join('\r\n');

    return new Promise((resolve, reject) => {
      let socket = null;
      let buffer = '';
      let stage = this.secure ? 'CONNECTED' : 'INIT';

      const cleanup = () => {
        if (socket && !socket.destroyed) {
          socket.destroy();
        }
      };

      const send = (cmd) => {
        if (!socket || socket.destroyed) return;
        socket.write(cmd + '\r\n');
      };

      const onData = (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\r\n');
        buffer = lines.pop(); // keep last incomplete line in buffer

        for (const line of lines) {
          if (!line) continue;
          const code = parseInt(line.substring(0, 3), 10);
          const isMultiline = line[3] === '-';
          if (isMultiline) continue;

          handleResponse(code, line);
        }
      };

      const handleResponse = (code, line) => {
        try {
          if (stage === 'INIT' && code === 220) {
            stage = 'EHLO_STARTTLS';
            send(`EHLO localhost`);
          } else if (stage === 'EHLO_STARTTLS' && code === 250) {
            stage = 'STARTTLS';
            send('STARTTLS');
          } else if (stage === 'STARTTLS' && code === 220) {
            // Upgrade plain socket to TLS
            socket.removeAllListeners('data');
            const tlsSocket = tls.connect({
              socket: socket,
              host: this.host,
              servername: this.host,
              rejectUnauthorized: false
            }, () => {
              stage = 'EHLO_AUTH';
              socket = tlsSocket;
              socket.on('data', onData);
              socket.on('error', (err) => { cleanup(); reject(err); });
              send(`EHLO localhost`);
            });
            tlsSocket.on('error', (err) => { cleanup(); reject(err); });
          } else if ((stage === 'CONNECTED' && code === 220) || (stage === 'EHLO_AUTH' && code === 250)) {
            stage = 'AUTH_LOGIN';
            send('AUTH LOGIN');
          } else if (stage === 'AUTH_LOGIN' && code === 334) {
            stage = 'AUTH_USER';
            send(Buffer.from(this.user).toString('base64'));
          } else if (stage === 'AUTH_USER' && code === 334) {
            stage = 'AUTH_PASS';
            send(Buffer.from(this.pass).toString('base64'));
          } else if (stage === 'AUTH_PASS' && code === 235) {
            stage = 'MAIL_FROM';
            // Extract pure email from From header
            const fromMatch = this.from.match(/<([^>]+)>/);
            const cleanFrom = fromMatch ? fromMatch[1] : this.from;
            send(`MAIL FROM:<${cleanFrom}>`);
          } else if (stage === 'MAIL_FROM' && code === 250) {
            stage = 'RCPT_TO';
            send(`RCPT TO:<${to}>`);
          } else if (stage === 'RCPT_TO' && code === 250) {
            stage = 'DATA';
            send('DATA');
          } else if (stage === 'DATA' && code === 354) {
            stage = 'MESSAGE';
            // Send payload ending with CRLF.CRLF
            socket.write(messageData + '\r\n.\r\n');
          } else if (stage === 'MESSAGE' && code === 250) {
            stage = 'QUIT';
            send('QUIT');
            cleanup();
            resolve({ success: true, messageId: line });
          } else if (code >= 400) {
            cleanup();
            reject(new Error(`SMTP Error (${code}): ${line}`));
          }
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      try {
        if (this.secure) {
          socket = tls.connect({
            host: this.host,
            port: this.port,
            servername: this.host,
            rejectUnauthorized: false
          }, () => {});
        } else {
          socket = net.connect({
            host: this.host,
            port: this.port
          }, () => {});
        }

        socket.on('data', onData);
        socket.on('error', (err) => {
          cleanup();
          reject(err);
        });

        // 15 second timeout
        socket.setTimeout(15000, () => {
          cleanup();
          reject(new Error('SMTP connection timed out'));
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }
}

export const smtp = new SmtpClient();
