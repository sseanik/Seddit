/**
 * Frontend Skeleton written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * Updated 2019.
 *
 * Frontend functionality written by Sean Smith for a COMP2041 Project
 * Updated 2020.
 */

import { createBanner, createBasePage } from "./Feed/base.js";
import { createLogin } from "./Auth/login.js";
import { createSignUp } from "./Auth/signup.js";
import { profilePage } from "./User/profile.js";

const API_URL = "http://0.0.0.0:5001";

const root = document.getElementById("root");

createBanner(API_URL);
createBasePage(API_URL, 0);
createLogin(API_URL);
createSignUp(API_URL);
profilePage(API_URL);
