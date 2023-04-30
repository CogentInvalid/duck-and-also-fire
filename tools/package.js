import { exec } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const zip = async () => {
	const output = createWriteStream(join(__dirname, '..', 'build', 'game.love'));
	const archive = archiver('zip', {
		zlib: { level: 9 },
	});

	// output.on('close', function() {
	// 	console.log(archive.pointer() + ' total bytes');
	// 	console.log('archiver has been finalized and the output file descriptor has closed.');
	// });

	// output.on('end', function() {
	// 	console.log('Data has been drained');
	// });

	archive.on('warning', function (err) {
		if (err.code === 'ENOENT') {
			// log warning
		} else {
			// throw error
			throw err;
		}
	});

	archive.on('error', function (err) {
		throw err;
	});

	archive.pipe(output);
	
	archive.file(join(__dirname, '..', 'main.lua'), { name: 'main.lua' });
	archive.file(join(__dirname, '..', 'conf.lua'), { name: 'conf.lua' });
	archive.directory(join(__dirname, '..', 'libs'), "libs");
	archive.directory(join(__dirname, '..', 'lua'), "lua");
	archive.directory(join(__dirname, '..', 'assets'), "assets");

	await archive.finalize();
}

const build = async (lovePath) => {
	const child = exec(`cmd.exe /c ` + lovePath, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	child.stdout.on('data', (data) => {
		console.log(data);
	});

	child.stderr.on('data', (data) => {
		console.error(data);
	});

	child.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
}

const copy = async (srcPath, destPath) => {
	const child = exec(`cmd.exe /c copy ${srcPath} ${destPath}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	child.stdout.on('data', (data) => {
		console.log(data);
	});

	child.stderr.on('data', (data) => {
		console.error(data);
	});

	child.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
}

const main = async () => {
	await zip();
	// await copy();
	console.log('done');
}

main();