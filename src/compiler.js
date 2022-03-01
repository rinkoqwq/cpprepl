"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var util_1 = require("util");
var os_1 = require("os");
var fs_1 = require("fs");
var path_1 = require("path");
var lodash_1 = require("lodash");
var file_1 = require("./file");
var execA = (0, util_1.promisify)(child_process_1.exec);
var writeFileA = (0, util_1.promisify)(fs_1.writeFile);
var copyFileA = (0, util_1.promisify)(fs_1.copyFile);
var accessA = (0, util_1.promisify)(fs_1.access);
var Compiler = /** @class */ (function () {
    function Compiler(compiler) {
        this.compiler = compiler;
        this.code = [];
        this.includes = ['dbg.h'];
        if (this.compiler === 'gcc' || this.compiler === 'clang')
            this.langExt = 'c';
        else
            this.langExt = 'cxx';
    }
    Compiler.wrapCodeWith = function (code, wrapper) {
        if (wrapper === void 0) { wrapper = 'value_of'; }
        code = (0, lodash_1.trim)(code, ';');
        return wrapper + "(" + code + ");";
    };
    Compiler.wrapInclude = function (module) {
        return "#include \"" + module + "\"";
    };
    Compiler.addSemicolon = function (code) {
        code = (0, lodash_1.trim)(code, ';');
        return code + ";";
    };
    Compiler.concatCode = function (code, includes) {
        var resCode = '';
        var resInclude = '';
        for (var _i = 0, includes_1 = includes; _i < includes_1.length; _i++) {
            var i = includes_1[_i];
            resInclude = resInclude.concat(Compiler.wrapInclude(i)) + '\n';
        }
        for (var _a = 0, code_1 = code; _a < code_1.length; _a++) {
            var i = code_1[_a];
            resCode = resCode.concat(i) + '\n';
        }
        return resInclude + "\nint main () {\n" + resCode + "\n}";
    };
    Compiler.isExist = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, accessA((0, path_1.join)((0, os_1.tmpdir)(), 'dbg.h'))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Compiler.prototype.basicCompile = function (code, includes) {
        return __awaiter(this, void 0, void 0, function () {
            var resCode, filepath, headerpath, execPath, exec_res, _a, cxx17, execCommand, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        resCode = Compiler.concatCode(code, includes);
                        filepath = (0, path_1.join)((0, os_1.tmpdir)(), "repl." + this.langExt);
                        headerpath = (0, path_1.join)((0, os_1.tmpdir)(), 'dbg.h');
                        execPath = (0, path_1.join)((0, os_1.tmpdir)(), (0, file_1.getOSExecName)());
                        return [4 /*yield*/, writeFileA(filepath, resCode)];
                    case 1:
                        _b.sent();
                        _a = copyFileA;
                        return [4 /*yield*/, (0, file_1.getLocalPath)((0, path_1.join)('template', 'dbg.h'))];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), headerpath])];
                    case 3:
                        _b.sent();
                        cxx17 = '';
                        if (this.langExt == 'cxx') {
                            cxx17 = '-std=c++17';
                        }
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        execCommand = this.compiler + " -w " + filepath + " " + cxx17 + " -fdiagnostics-color -o " + execPath;
                        return [4 /*yield*/, execA(execCommand, { windowsHide: true })];
                    case 5:
                        exec_res = _b.sent();
                        return [2 /*return*/, {
                                success: true,
                                output: exec_res.stderr
                            }];
                    case 6:
                        e_2 = _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                output: e_2.stderr
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Compiler.isCommand = function (code) {
        code = (0, lodash_1.trim)(code);
        if (code === '')
            return false;
        return code[0] === ':';
    };
    Compiler.prototype.processInput = function (line) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Compiler.isCommand(line) ? this.command(line) : this.compile(line)];
            });
        });
    };
    Compiler.prototype.command = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var oprandArr, oprand, i, tmp, r, _a, tmpInclude, compileRes, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 13]);
                        oprandArr = cmd.split(' ');
                        oprand = '';
                        for (i = 1; i < oprandArr.length; ++i) {
                            oprand += oprandArr[i] + (i == oprandArr.length - 1 ? '' : ' ');
                        }
                        tmp = __spreadArray([], this.code, true);
                        r = void 0;
                        _a = oprandArr[0];
                        switch (_a) {
                            case ':b': return [3 /*break*/, 1];
                            case ':bin': return [3 /*break*/, 1];
                            case ':x': return [3 /*break*/, 3];
                            case ':hex': return [3 /*break*/, 3];
                            case ':h': return [3 /*break*/, 5];
                            case ':help': return [3 /*break*/, 5];
                            case ':m': return [3 /*break*/, 6];
                            case ':module': return [3 /*break*/, 6];
                            case ':t': return [3 /*break*/, 8];
                            case ':type': return [3 /*break*/, 8];
                            case ':q': return [3 /*break*/, 10];
                            case ':quit': return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 11];
                    case 1:
                        tmp.push(Compiler.wrapCodeWith(oprand, 'print_bytes'));
                        return [4 /*yield*/, this.basicCompile(tmp, this.includes)];
                    case 2:
                        r = _b.sent();
                        return [2 /*return*/, r];
                    case 3:
                        tmp.push(Compiler.wrapCodeWith(oprand, 'print_hex'));
                        return [4 /*yield*/, this.basicCompile(tmp, this.includes)];
                    case 4:
                        r = _b.sent();
                        return [2 /*return*/, r];
                    case 5: return [2 /*return*/, {
                            success: true,
                            output: ''
                        }];
                    case 6:
                        tmpInclude = __spreadArray([], this.includes, true);
                        tmpInclude.push(oprand);
                        return [4 /*yield*/, this.basicCompile(this.code, tmpInclude)];
                    case 7:
                        compileRes = _b.sent();
                        if (compileRes.success) {
                            this.includes.push(oprand);
                        }
                        return [2 /*return*/, {
                                success: compileRes.success,
                                output: compileRes.success ? "Load " + oprand + " success\n" : "Fail to load " + oprand + "\n"
                            }];
                    case 8:
                        tmp.push(Compiler.wrapCodeWith(oprand, 'type_of'));
                        return [4 /*yield*/, this.basicCompile(tmp, this.includes)];
                    case 9:
                        r = _b.sent();
                        return [2 /*return*/, r];
                    case 10:
                        process.exit(0);
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_3 = _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                output: e_3.message
                            }];
                    case 13: return [2 /*return*/, {
                            success: false,
                            output: 'match command failed\n'
                        }];
                }
            });
        });
    };
    Compiler.prototype.compile = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var tmp, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = Compiler.addSemicolon(code);
                        tmp = __spreadArray([], this.code, true);
                        tmp.push(Compiler.wrapCodeWith(code));
                        return [4 /*yield*/, this.basicCompile(tmp, this.includes)];
                    case 1:
                        r = _a.sent();
                        if (!!r.success) return [3 /*break*/, 3];
                        tmp.pop();
                        tmp.push(code);
                        return [4 /*yield*/, this.basicCompile(tmp, this.includes)];
                    case 2:
                        r = _a.sent();
                        if (r.success) {
                            this.code.push(code);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.code.push(code);
                        _a.label = 4;
                    case 4: return [2 /*return*/, r];
                }
            });
        });
    };
    Compiler.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var execPath, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        execPath = (0, path_1.join)((0, os_1.tmpdir)(), (0, file_1.getOSExecName)());
                        return [4 /*yield*/, execA(execPath, { windowsHide: true })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.stdout];
                }
            });
        });
    };
    return Compiler;
}());
exports["default"] = Compiler;
