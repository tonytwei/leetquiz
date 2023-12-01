// userDataRaw
userDataRaw = userDataRaw.replace(/&#34;/g, '\"');
let userData = JSON.parse(userDataRaw);

document.addEventListener("DOMContentLoaded", () => {
    console.log(userData);
});