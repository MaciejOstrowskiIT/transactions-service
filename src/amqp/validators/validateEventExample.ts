import * as Joi from 'joi';

type ExampleType = {
    name: string
}
export const schema:Joi.ObjectSchema<ExampleType> = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required(),
})