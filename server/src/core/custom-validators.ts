import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { isValidObjectId } from 'mongoose'

@ValidatorConstraint({ name: 'customText', async: false })
export class IsValidObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    return isValidObjectId(text)
  }

  defaultMessage() {
    return 'Not valid _id'
  }
}
