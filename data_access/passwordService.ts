export function passwrdMeetsRequirements(password: string) : boolean {
    let passwordRegEx = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    
    return passwordRegEx.test(password);
}