// app/api/run/route.js
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  const { language, code } = await req.json();

  const fileMap = {
    javascript: 'code.js',
    python: 'code.py',
    cpp: 'code.cpp',
  };

  const fileExtension = fileMap[language];
  const filePath = path.join('/tmp', fileExtension);

  fs.writeFileSync(filePath, code);

  const commandMap = {
    javascript: `node ${filePath}`,
    python: `python3 ${filePath}`,
    cpp: `g++ ${filePath} -o /tmp/code.out && /tmp/code.out`,
  };

  const command = commandMap[language];

  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        resolve(new Response(stderr || err.message, { status: 500 }));
        return;
      }
      resolve(new Response(stdout || stderr, { status: 200 }));
    });
  });
}
