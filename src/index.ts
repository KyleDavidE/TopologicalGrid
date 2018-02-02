import {App} from "./App";

const app = new App();


(window as {[x:string]:any}).app = app;