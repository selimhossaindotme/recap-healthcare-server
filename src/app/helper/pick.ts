


const pick = <T extends Record<string, unknown>, K extends keyof T> (obj: T, keys: K[]) : Partial<T> => {
    // console.log("obj", obj);
    const finalObject : Partial<T> = {};

    for ( const key of keys ) {
        if (obj && Object.hasOwnProperty.call(obj, key)){
            finalObject[key] = obj[key];
        }
    }

    // console.log("finalObject", finalObject);

    return finalObject;
}

export default pick;