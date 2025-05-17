import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { schema } from './schema.ts'
import { useState, useEffect } from 'react';
import type { IChangeEvent } from '@rjsf/core';
import { FORM_STORAGE_KEY } from './consts.ts'

export default function ServerForm() {
    const [formData, setFormData] = useState<any>(null);
    const [readyToSaveLocally, setReadyToSaveocally] = useState(false);

    useEffect(() => {
        const loadFormData = async () => {
            try {
                if (window.electronAPI) {
                    const hasData = await window.electronAPI.storeHas(FORM_STORAGE_KEY);
                    if (hasData) {
                        const savedData = await window.electronAPI.storeGet(FORM_STORAGE_KEY);
                        setFormData(savedData);
                        console.log('Loaded form data from store:', savedData);
                    }
                }
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        };

        loadFormData()
            .finally(() => setReadyToSaveocally(true));
    }, []);

    const handleChange = async (e: IChangeEvent) => {
        console.log('Form changed:', e.formData);
        setFormData(e.formData);
        if (readyToSaveLocally) {
            await window.electronAPI.storeSet(FORM_STORAGE_KEY, e.formData);
            console.log('Form data saved to store');
        }
    };

    const handleSubmit = async (e: IChangeEvent) => {
        console.log('Form submitted:', e.formData);
        try {
            if (window.electronAPI) {
                await window.electronAPI.storeSet(FORM_STORAGE_KEY, e.formData);
                console.log('Form data saved to store');
            }
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const handleError = (errors: any) => {
        console.log('Form validation errors:', errors);
    };

    return (
        <Form
            uiSchema={{
                "ui:submitButtonOptions": {
                    "norender": true,
                },
            }}
            schema={ schema }
            validator={ validator }
            formData={ formData }
            onChange={ handleChange }
            onSubmit={ handleSubmit }
            onError={ handleError }
        />
    );
}
