import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { client } from '@gradio/client'

const PORT = 6789;
const SERVER = "http://localhost:8082";
const expressApp = express();

expressApp.use(cors());
expressApp.use(morgan('dev'));
expressApp.use(express.json());

expressApp.post('/list-voices', async (req, res) => {
    try {
        const app = await client(SERVER);
        const response = await app.predict("/show_inbuild_voices", [
            true,
        ]);

        res.status(200).json(
            response.data[0].choices.map(([name]) => ({
                id: name,
                name,
                category: 'XTTS',
                languageCode: 'en-US',
            })),
        )
    } catch (error) {
        console.error('Error fetching voices:', error);
        res.status(500).json({ error: 'Failed to fetch TTS voices' });
    }
});

expressApp.post('/synthesize-speech', async (req, res) => {
    try {
        const {
            body: {
                payload: {
                    text,
                    voice: {
                        id,
                    },
                },
            },
        } = req

        const app = await client(SERVER);
        const result = await app.predict("/generate_audio", [
            8,
            1,
            "Midpoint",
            64,
            0.5,
            true,
            "",
            "",
            [],
            0,
            0.75,
            0.33,
            "rmvpe",
            3,
            0,
            1,
            "None",
            null,
            "",
            "",
            null,
            "",
            false,
            false,
            false,
            false,
            false,
            "None",
            "mp3",
            text,
            "English",
            id,
            "",
            "output",
            "XTTS",
            0.75,
            1,
            5,
            50,
            0.85,
            1,
            true,
            {
                "label": "Done",
                "confidences": null
            }
        ]);
        // const audioPath = "C:\\Users\\pc\\Downloads\\something_something.mp3";
        const audioPath = result.data[1].path;

        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
        })

        const readStream = fs.createReadStream(audioPath)
        readStream.pipe(res)
        // the server uses something like that but I couldn't make it work
        // const response = await fetch(`${ SERVER }/file=${ audioPath }`)
        // const readStream = response.body
        //
        // res.writeHead(200, {
        //     'Content-Type': 'audio/mpeg',
        // })
        //
        // if (!readStream) {
        //     throw new Error('Failed to get response stream')
        // }
        //
        // Readable.fromWeb(readStream).pipe(res);
    } catch (error) {
        console.error('Error generating speech:', error);
        res.status(500).json({ 
            error: 'Failed to generate speech',
            details: error.message
        });
    }
});

export function startExpressServer() {
    return new Promise((resolve, reject) => {
        const server = expressApp.listen(PORT, () => {
            console.log(`Express server started on port ${PORT}`);
            resolve(server);
        });
        
        server.on('error', (err) => {
            console.error('Failed to start Express server:', err);
            reject(err);
        });
    });
}

export default expressApp;
