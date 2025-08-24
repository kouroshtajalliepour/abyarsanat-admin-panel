
export default function validateULID(id:string):string {

    if (!id || !ULIDIsValid(id)) {
        throw new Error("entities.errors.general.id.invalidFormat")
    }

    return id
}



function ULIDIsValid (id:string) {
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(id);
}