module.exports = class User {
    constructor(resp) {
        this.userName = resp.userName;
        this.firstName = resp.firstName;
        this.lastName = resp.lastName;
        this.email = resp.email;
        this.passowrd = resp.passowrd;
        this.phoneNumber = resp.phoneNumber;
    }
}