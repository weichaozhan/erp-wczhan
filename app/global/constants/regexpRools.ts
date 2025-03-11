export const PWD_REG = /^(?=.*\d)(?!.*(\d)\1{2})(?!.*(012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210))(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{1,}$/;
export const USRNAME_REG = /^(\d|\w|_|[\u4e00-\u9fa5])+$/;

export const EMAIL_REG = /^\w+(-+.\w+)*@\w+(-.\w+)*.\w+(-.\w+)*$/;
