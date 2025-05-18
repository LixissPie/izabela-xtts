import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import { client } from '@gradio/client'
import {schema} from '../src/forms/xtts/schema.ts'
import orderBy from 'lodash/orderBy'
import { store } from './store.ts'
import { FORM_STORAGE_KEY } from '../src/forms/xtts/consts.ts'

const PORT = 6789;
const SERVER = "http://localhost:8010";
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
        const orderedDefaultSchema = orderBy(Object.entries(schema.properties), ([_, property]: any) => property['x-index'], 'asc') as [string, object]
        const defaultPayload = orderedDefaultSchema.map(([_, property]: any) => property.default)
        const formData = store.get(FORM_STORAGE_KEY, {}) as object
        const storedPayload = orderBy(Object.entries(formData), ([key]) => schema.properties[key]['x-index'], 'asc').map(([_, value]) => value)
        // console.log('schema', defaultPayload)
        // console.log('stored', storedPayload)
        const payload = [...defaultPayload]
        storedPayload.forEach((value, index) => {
            payload[index] = value;
        })
        payload[orderedDefaultSchema.findIndex(([key]: any) => key === 'inputText')] = text
        payload[orderedDefaultSchema.findIndex(([key]: any) => key === 'referenceSpeakerName')] = id

        // console.log('final', payload)
        const app = await client(SERVER);
        const result = await app.predict("/generate_audio", payload);
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
