import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { schema } from './schema.ts'

const log = (type: string) => console.log.bind(console, type);
export default function ServerForm() {
    return (
        <Form
            schema={ schema }
            validator={ validator }
            onChange={ log('changed') }
            onSubmit={ log('submitted') }
            onError={ log('errors') }
        />
    )
}