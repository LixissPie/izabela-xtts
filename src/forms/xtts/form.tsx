import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv8';
import { schema } from './schema.ts'
import { useState, useEffect } from 'react';
import type { IChangeEvent } from '@rjsf/core';
import { FORM_STORAGE_KEY } from './consts.ts'
import { Button, Dialog, VStack } from '@chakra-ui/react'
import { X } from 'lucide-react'

export default function ServerForm() {
    const [formData, setFormData] = useState<any>(null);
    const [readyToSaveLocally, setReadyToSaveocally] = useState(false);
    const [open, setOpen] = useState(false);
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

    const updateFormData = async (formData: any) => {
        setFormData(formData);
        if (readyToSaveLocally) {
            await window.electronAPI.storeSet(FORM_STORAGE_KEY, formData);
            console.log('Form data saved to store');
        }
    }

    const handleChange = async (e: IChangeEvent) => {
        console.log('Form changed:', e.formData);
        updateFormData(e.formData);
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
        <VStack>
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
            <Dialog.Root open={open} onOpenChange={({open}) => setOpen(open)} placement={'bottom'}>
                <Dialog.Trigger asChild>
                    <Button className={'w-full'}>Reset form</Button>
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger>
                            <X/>
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>
                                Reset form
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            Do you want to reset the form?
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button className={'w-full'} onClick={() => {
                                updateFormData(Object.fromEntries(Object.entries(schema.properties).map((([key, properties]: any) => [key, properties.default]))))
                                setOpen(false)
                            }}>Reset now</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </VStack>
    );
}
