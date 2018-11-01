export const MissingError = (...key) => {
    console.error(`Missing parameters [${key.join(',')}]`);
};
