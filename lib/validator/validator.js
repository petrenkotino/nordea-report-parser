const joi = require('joi');

export { joi };
export function validate(obj_to_validate, validation_schema) {
    const validated_object = joi.validate(obj_to_validate, validation_schema);
    if (validated_object.error) {
        throw new Error(validated_object.error);
    }
    return validated_object.value;
}
