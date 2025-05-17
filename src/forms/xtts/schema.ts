import type { RJSFSchema } from '@rjsf/utils'

export const schema: RJSFSchema = {
    title: "XTTS Server",
    type: "object",
    properties: {
        chunkSeconds: {
            type: "number",
            title: "Chunk seconds",
            description: "More seconds means more VRAM usage and faster inference speed",
            minimum: 2,
            maximum: 40,
            default: 2,
            "x-index": 0
        },
        overlapSeconds: {
            type: "number",
            title: "Overlap seconds",
            minimum: 0.1,
            maximum: 2,
            default: 0.1,
            "x-index": 1
        },
        cfmSolver: {
            type: "string",
            title: "CFM ODE Solver",
            description: "Midpoint is recommended",
            enum: ["Midpoint"],
            default: "Midpoint",
            "x-index": 2
        },
        cfmEvaluations: {
            type: "number",
            title: "CFM Number of Function Evaluations",
            description: "Higher values in general yield better quality but may be slower",
            minimum: 1,
            maximum: 128,
            default: 1,
            "x-index": 3
        },
        cfmPriorTemperature: {
            type: "number",
            title: "CFM Prior Temperature",
            description: "Higher values can improve quality but can reduce stability",
            minimum: 0,
            maximum: 1,
            default: 0,
            "x-index": 4
        },
        denoiseBeforeEnhancement: {
            type: "boolean",
            title: "Denoise Before Enhancement",
            description: "Tick if your audio contains heavy background noise",
            default: true,
            "x-index": 5
        },
        rvcModel: {
            type: "string",
            title: "RVC Model",
            default: "Hello!!",
            "x-index": 6
        },
        indexFile: {
            type: "string",
            title: "Index file",
            default: "Hello!!",
            "x-index": 7
        },
        rvcModelName: {
            type: "string",
            title: "RVC Model name",
            "x-index": 8
        },
        pitch: {
            type: "number",
            title: "Pitch",
            minimum: -24,
            maximum: 24,
            default: -24,
            "x-index": 9
        },
        indexRate: {
            type: "number",
            title: "Index rate",
            minimum: 0,
            maximum: 1,
            default: 0,
            "x-index": 10
        },
        protectVoiceless: {
            type: "number",
            title: "Protect voiceless",
            minimum: 0,
            maximum: 0.5,
            default: 0,
            "x-index": 11
        },
        rvcMethod: {
            type: "string",
            title: "RVC Method",
            enum: ["crepe"],
            default: "crepe",
            "x-index": 12
        },
        medianFilterRadius: {
            type: "number",
            title: "Median Filter Radius",
            description: "If >=3: apply median filtering to the harvested pitch results. Can reduce breathiness",
            minimum: 0,
            maximum: 7,
            default: 0,
            "x-index": 13
        },
        resampleRate: {
            type: "number",
            title: "Resample Rate",
            description: "Resample the output audio in post-processing to the final sample rate. Set to 0 for no resampling",
            minimum: 0,
            maximum: 48000,
            default: 0,
            "x-index": 14
        },
        volumeEnvelopeRatio: {
            type: "number",
            title: "Volume Envelope Ratio",
            description: "Mix ratio between input and output volume envelope",
            minimum: 0,
            maximum: 1,
            default: 0,
            "x-index": 15
        },
        referenceSample: {
            type: "string",
            title: "Reference sample",
            enum: ["None"],
            default: "None",
            "x-index": 16
        },
        txtFile: {
            type: "string",
            format: "data-url",
            title: "Upload .txt files",
            "x-index": 17
        },
        txtFolderPath: {
            type: "string",
            title: "Path to folder with .txt files",
            description: "Has priority over all",
            default: "Hello!!",
            "x-index": 18
        },
        parameter128: {
            type: "string",
            title: "parameter_128",
            default: "Hello!!",
            "x-index": 19
        },
        subtitleFile: {
            type: "string",
            format: "data-url",
            title: "Upload srt or ass files",
            "x-index": 20
        },
        subtitleFolderPath: {
            type: "string",
            title: "Path to folder with srt or ass",
            description: "Has priority over all",
            default: "Hello!!",
            "x-index": 21
        },
        syncSubtitles: {
            type: "boolean",
            title: "Synchronise subtitle timings",
            default: true,
            "x-index": 22
        },
        enableLanguageAutoDetect: {
            type: "boolean",
            title: "Enable language auto detect",
            default: true,
            "x-index": 23
        },
        enableWaveform: {
            type: "boolean",
            title: "Enable Waveform",
            default: true,
            "x-index": 24
        },
        improveQuality: {
            type: "boolean",
            title: "Improve output quality",
            default: true,
            "x-index": 25
        },
        resembleEnhancement: {
            type: "boolean",
            title: "Resemble enhancement",
            default: true,
            "x-index": 26
        },
        voiceImprovement: {
            type: "string",
            title: "Use RVC or OpenVoice to improve result",
            enum: ["RVC"],
            default: "RVC",
            "x-index": 27
        },
        outputType: {
            type: "string",
            title: "Output Type",
            enum: ["mp3"],
            default: "mp3",
            "x-index": 28
        },
        inputText: {
            type: "string",
            title: "Input Text",
            default: "Hello!!",
            "x-index": 29
        },
        language: {
            type: "string",
            title: "Language",
            enum: ["Arabic"],
            default: "Arabic",
            "x-index": 30
        },
        referenceSpeakerName: {
            type: "string",
            title: "Reference Speaker Name",
            default: "Hello!!",
            "x-index": 31
        },
        referenceSpeakerPath: {
            type: "string",
            title: "Reference Speaker Path",
            default: "Hello!!",
            "x-index": 32
        },
        fileName: {
            type: "string",
            title: "File Name Value",
            default: "Hello!!",
            "x-index": 33
        },
        voiceEngine: {
            type: "string",
            title: "Select Voice Engine",
            enum: ["XTTS"],
            default: "XTTS",
            "x-index": 34
        },
        temperature: {
            type: "number",
            title: "Temperature",
            minimum: 0.01,
            maximum: 1,
            default: 0.01,
            "x-index": 35
        },
        lengthPenalty: {
            type: "number",
            title: "Length Penalty",
            minimum: -10.0,
            maximum: 10.0,
            default: -10,
            "x-index": 36
        },
        repetitionPenalty: {
            type: "number",
            title: "Repetition Penalty",
            minimum: 1,
            maximum: 10,
            default: 1,
            "x-index": 37
        },
        topK: {
            type: "number",
            title: "Top K",
            minimum: 1,
            maximum: 100,
            default: 1,
            "x-index": 38
        },
        topP: {
            type: "number",
            title: "Top P",
            minimum: 0.01,
            maximum: 1,
            default: 0.01,
            "x-index": 39
        },
        speed: {
            type: "number",
            title: "Speed",
            minimum: 0.1,
            maximum: 2,
            default: 0.1,
            "x-index": 40
        },
        enableTextSplitting: {
            type: "boolean",
            title: "Enable text splitting",
            default: true,
            "x-index": 41
        },
        statusBar: {
            type: "object",
            title: "Status bar",
            "x-index": 42
        }
    }
};