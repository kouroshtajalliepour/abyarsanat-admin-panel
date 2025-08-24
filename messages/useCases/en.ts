export default {
    errors: {
        general: {
            langNotAvailable:"Language not available",
            invalidField:"Field is not a allowed",
            notFound: "Not found",
            fieldNotSpecified: "At least one field is required",
            accessDenied: "Access denied",
            invalidAuthType: "Invalid auth type",
            platformIsRequired: "Platform is required",
            tokenNotFound: "Token not found",
            invalidIp: "Invalid IP address",
            fieldNotUnique: "This value is taken",
            unExpected: "Unexpected error occurred",
            invalidToken:"Invalid token",
            timeout: "Timeout exceeded",
            sameAuthor: "Please click on the logo on top of the menu to edit the author you are logged in as",
            sameAuthorToken: "You cannot delete the token you are logged in with",
            captcha: {
                required: "Captcha token required",
                invalid: "Invalid Captcha token",
            },
            filters: {
                anyCondition: {
                    invalidFormat: "Invalid format for 'anyCondition' field",
                },
                created_at: {
                    invalidFormat: "Invalid format for 'created_at' field",
                },
                availableOnLocale: {
                    invalidFormat: "Invalid format for 'availableOnLocale' field",
                },
                orderBy: {
                    invalidFormat: "Invalid format for 'orderBy' field",
                },
                pageNumber: {
                    invalidFormat: "Invalid format for 'pageNumber' field",
                },
                pageSize: {
                    invalidFormat: "Invalid format for 'pageSize' field",
                    moreThan50:"Page size cannot be greater than 50"
                },
                count: {
                    invalidFormat: "Invalid format for 'count' field",
                },
                author: {
                    invalidFormat: "Invalid format for 'author' field",
                },
                row_id: {
                    invalidFormat: "Invalid format for 'row_id' field",
                },
                number: {
                    invalidFormat: "Invalid format for 'number' field",
                },
                date: {
                    invalidFormat: "Invalid format for 'date' field",
                },
                arrayField: {
                    moreThan50: "Array length cannot exceed 50",
                },
            }
        }
    }
}