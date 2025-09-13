import * as http from 'http';

export class HttpServer {
  private server: http.Server | null = null;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
  }

  public start() {
    if (this.server) {
      console.log('Server is running!');
      return;
    }

    this.server = http.createServer((req, res) => {
      if (req.url && req.url.startsWith('/auth/callback')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Login Completed</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #1F2937;
                }

                .container {
                  text-align: center;
                  background: #fff;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                h1 {
                  color: #4CAF50;
                }

                p {
                  color: #333;
                  font-size: 16px;
                }

                .close-btn {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #4CAF50;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  transition: background-color 0.2s ease;
                }

                .close-btn:hover {
                  background-color: #45a049;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Login Successful</h1>
                <p>You can now close this window and return to the application.</p>
                <a href="#" class="close-btn" onclick="window.close()">Close Window</a>
              </div>
            </body>
          </html>
        `);

        this.stop();
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    this.server.listen(this.port, () => {
      console.log(`Callback server running in http://localhost:${this.port}`);
    });

    this.server.on('error', (err) => {
      console.error('Server error:', err);
    });
  }

  public stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Callback server finished!');
      });
      this.server = null;
    }
  }
}
