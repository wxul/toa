function QR8bitByte(e) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = e
}
function QRCode(e, t) {
    this.typeNumber = e;
    this.errorCorrectLevel = t;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = new Array
}
function QRPolynomial(e, t) {
    if (e.length == undefined) {
        throw new Error(e.length + "/" + t)
    }
    var n = 0;
    while (n < e.length && e[n] == 0) {
        n++
    }
    this.num = new Array(e.length - n + t);
    for (var r = 0; r < e.length - n; r++) {
        this.num[r] = e[r + n]
    }
}
function QRRSBlock(e, t) {
    this.totalCount = e;
    this.dataCount = t
}
function QRBitBuffer() {
    this.buffer = new Array;
    this.length = 0
}
QR8bitByte.prototype = {
    getLength: function(e) {
        return this.data.length
    },
    write: function(e) {
        for (var t = 0; t < this.data.length; t++) {
            e.put(this.data.charCodeAt(t), 8)
        }
    }
};
QRCode.prototype = {
    addData: function(e) {
        var t = new QR8bitByte(e);
        this.dataList.push(t);
        this.dataCache = null
    },
    isDark: function(e, t) {
        if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t) {
            throw new Error(e + "," + t)
        }
        return this.modules[e][t]
    },
    getModuleCount: function() {
        return this.moduleCount
    },
    make: function() {
        if (this.typeNumber < 1) {
            var e = 1;
            for (e = 1; e < 40; e++) {
                var t = QRRSBlock.getRSBlocks(e, this.errorCorrectLevel);
                var n = new QRBitBuffer;
                var r = 0;
                for (var i = 0; i < t.length; i++) {
                    r += t[i].dataCount
                }
                for (var i = 0; i < this.dataList.length; i++) {
                    var s = this.dataList[i];
                    n.put(s.mode, 4);
                    n.put(s.getLength(), QRUtil.getLengthInBits(s.mode, e));
                    s.write(n)
                }
                if (n.getLengthInBits() <= r * 8)
                    break
            }
            this.typeNumber = e
        }
        this.makeImpl(false, this.getBestMaskPattern())
    },
    makeImpl: function(e, t) {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (var n = 0; n < this.moduleCount; n++) {
            this.modules[n] = new Array(this.moduleCount);
            for (var r = 0; r < this.moduleCount; r++) {
                this.modules[n][r] = null
            }
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(e, t);
        if (this.typeNumber >= 7) {
            this.setupTypeNumber(e)
        }
        if (this.dataCache == null) {
            this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)
        }
        this.mapData(this.dataCache, t)
    },
    setupPositionProbePattern: function(e, t) {
        for (var n = -1; n <= 7; n++) {
            if (e + n <= -1 || this.moduleCount <= e + n)
                continue;
            for (var r = -1; r <= 7; r++) {
                if (t + r <= -1 || this.moduleCount <= t + r)
                    continue;
                if (0 <= n && n <= 6 && (r == 0 || r == 6) || 0 <= r && r <= 6 && (n == 0 || n == 6) || 2 <= n && n <= 4 && 2 <= r && r <= 4) {
                    this.modules[e + n][t + r] = true
                } else {
                    this.modules[e + n][t + r] = false
                }
            }
        }
    },
    getBestMaskPattern: function() {
        var e = 0;
        var t = 0;
        for (var n = 0; n < 8; n++) {
            this.makeImpl(true, n);
            var r = QRUtil.getLostPoint(this);
            if (n == 0 || e > r) {
                e = r;
                t = n
            }
        }
        return t
    },
    createMovieClip: function(e, t, n) {
        var r = e.createEmptyMovieClip(t, n);
        var i = 1;
        this.make();
        for (var s = 0; s < this.modules.length; s++) {
            var o = s * i;
            for (var u = 0; u < this.modules[s].length; u++) {
                var a = u * i;
                var f = this.modules[s][u];
                if (f) {
                    r.beginFill(0, 100);
                    r.moveTo(a, o);
                    r.lineTo(a + i, o);
                    r.lineTo(a + i, o + i);
                    r.lineTo(a, o + i);
                    r.endFill()
                }
            }
        }
        return r
    },
    setupTimingPattern: function() {
        for (var e = 8; e < this.moduleCount - 8; e++) {
            if (this.modules[e][6] != null) {
                continue
            }
            this.modules[e][6] = e % 2 == 0
        }
        for (var t = 8; t < this.moduleCount - 8; t++) {
            if (this.modules[6][t] != null) {
                continue
            }
            this.modules[6][t] = t % 2 == 0
        }
    },
    setupPositionAdjustPattern: function() {
        var e = QRUtil.getPatternPosition(this.typeNumber);
        for (var t = 0; t < e.length; t++) {
            for (var n = 0; n < e.length; n++) {
                var r = e[t];
                var i = e[n];
                if (this.modules[r][i] != null) {
                    continue
                }
                for (var s = -2; s <= 2; s++) {
                    for (var o = -2; o <= 2; o++) {
                        if (s == -2 || s == 2 || o == -2 || o == 2 || s == 0 && o == 0) {
                            this.modules[r + s][i + o] = true
                        } else {
                            this.modules[r + s][i + o] = false
                        }
                    }
                }
            }
        }
    },
    setupTypeNumber: function(e) {
        var t = QRUtil.getBCHTypeNumber(this.typeNumber);
        for (var n = 0; n < 18; n++) {
            var r = !e && (t >> n & 1) == 1;
            this.modules[Math.floor(n / 3)][n % 3 + this.moduleCount - 8 - 3] = r
        }
        for (var n = 0; n < 18; n++) {
            var r = !e && (t >> n & 1) == 1;
            this.modules[n % 3 + this.moduleCount - 8 - 3][Math.floor(n / 3)] = r
        }
    },
    setupTypeInfo: function(e, t) {
        var n = this.errorCorrectLevel << 3 | t;
        var r = QRUtil.getBCHTypeInfo(n);
        for (var i = 0; i < 15; i++) {
            var s = !e && (r >> i & 1) == 1;
            if (i < 6) {
                this.modules[i][8] = s
            } else if (i < 8) {
                this.modules[i + 1][8] = s
            } else {
                this.modules[this.moduleCount - 15 + i][8] = s
            }
        }
        for (var i = 0; i < 15; i++) {
            var s = !e && (r >> i & 1) == 1;
            if (i < 8) {
                this.modules[8][this.moduleCount - i - 1] = s
            } else if (i < 9) {
                this.modules[8][15 - i - 1 + 1] = s
            } else {
                this.modules[8][15 - i - 1] = s
            }
        }
        this.modules[this.moduleCount - 8][8] = !e
    },
    mapData: function(e, t) {
        var n = -1;
        var r = this.moduleCount - 1;
        var i = 7;
        var s = 0;
        for (var o = this.moduleCount - 1; o > 0; o -= 2) {
            if (o == 6)
                o--;
            while (true) {
                for (var u = 0; u < 2; u++) {
                    if (this.modules[r][o - u] == null) {
                        var a = false;
                        if (s < e.length) {
                            a = (e[s] >>> i & 1) == 1
                        }
                        var f = QRUtil.getMask(t, r, o - u);
                        if (f) {
                            a = !a
                        }
                        this.modules[r][o - u] = a;
                        i--;
                        if (i == -1) {
                            s++;
                            i = 7
                        }
                    }
                }
                r += n;
                if (r < 0 || this.moduleCount <= r) {
                    r -= n;
                    n = -n;
                    break
                }
            }
        }
    }
};
QRCode.PAD0 = 236;
QRCode.PAD1 = 17;
QRCode.createData = function(e, t, n) {
    var r = QRRSBlock.getRSBlocks(e, t);
    var i = new QRBitBuffer;
    for (var s = 0; s < n.length; s++) {
        var o = n[s];
        i.put(o.mode, 4);
        i.put(o.getLength(), QRUtil.getLengthInBits(o.mode, e));
        o.write(i)
    }
    var u = 0;
    for (var s = 0; s < r.length; s++) {
        u += r[s].dataCount
    }
    if (i.getLengthInBits() > u * 8) {
        throw new Error("code length overflow. (" + i.getLengthInBits() + ">" + u * 8 + ")")
    }
    if (i.getLengthInBits() + 4 <= u * 8) {
        i.put(0, 4)
    }
    while (i.getLengthInBits() % 8 != 0) {
        i.putBit(false)
    }
    while (true) {
        if (i.getLengthInBits() >= u * 8) {
            break
        }
        i.put(QRCode.PAD0, 8);
        if (i.getLengthInBits() >= u * 8) {
            break
        }
        i.put(QRCode.PAD1, 8)
    }
    return QRCode.createBytes(i, r)
}
;
QRCode.createBytes = function(e, t) {
    var n = 0;
    var r = 0;
    var i = 0;
    var s = new Array(t.length);
    var o = new Array(t.length);
    for (var u = 0; u < t.length; u++) {
        var a = t[u].dataCount;
        var f = t[u].totalCount - a;
        r = Math.max(r, a);
        i = Math.max(i, f);
        s[u] = new Array(a);
        for (var l = 0; l < s[u].length; l++) {
            s[u][l] = 255 & e.buffer[l + n]
        }
        n += a;
        var c = QRUtil.getErrorCorrectPolynomial(f);
        var h = new QRPolynomial(s[u],c.getLength() - 1);
        var p = h.mod(c);
        o[u] = new Array(c.getLength() - 1);
        for (var l = 0; l < o[u].length; l++) {
            var d = l + p.getLength() - o[u].length;
            o[u][l] = d >= 0 ? p.get(d) : 0
        }
    }
    var v = 0;
    for (var l = 0; l < t.length; l++) {
        v += t[l].totalCount
    }
    var m = new Array(v);
    var g = 0;
    for (var l = 0; l < r; l++) {
        for (var u = 0; u < t.length; u++) {
            if (l < s[u].length) {
                m[g++] = s[u][l]
            }
        }
    }
    for (var l = 0; l < i; l++) {
        for (var u = 0; u < t.length; u++) {
            if (l < o[u].length) {
                m[g++] = o[u][l]
            }
        }
    }
    return m
}
;
var QRMode = {
    MODE_NUMBER: 1 << 0,
    MODE_ALPHA_NUM: 1 << 1,
    MODE_8BIT_BYTE: 1 << 2,
    MODE_KANJI: 1 << 3
};
var QRErrorCorrectLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
};
var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
};
var QRUtil = {
    PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
    G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0,
    G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0,
    G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1,
    getBCHTypeInfo: function(e) {
        var t = e << 10;
        while (QRUtil.getBCHDigit(t) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            t ^= QRUtil.G15 << QRUtil.getBCHDigit(t) - QRUtil.getBCHDigit(QRUtil.G15)
        }
        return (e << 10 | t) ^ QRUtil.G15_MASK
    },
    getBCHTypeNumber: function(e) {
        var t = e << 12;
        while (QRUtil.getBCHDigit(t) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            t ^= QRUtil.G18 << QRUtil.getBCHDigit(t) - QRUtil.getBCHDigit(QRUtil.G18)
        }
        return e << 12 | t
    },
    getBCHDigit: function(e) {
        var t = 0;
        while (e != 0) {
            t++;
            e >>>= 1
        }
        return t
    },
    getPatternPosition: function(e) {
        return QRUtil.PATTERN_POSITION_TABLE[e - 1]
    },
    getMask: function(e, t, n) {
        switch (e) {
        case QRMaskPattern.PATTERN000:
            return (t + n) % 2 == 0;
        case QRMaskPattern.PATTERN001:
            return t % 2 == 0;
        case QRMaskPattern.PATTERN010:
            return n % 3 == 0;
        case QRMaskPattern.PATTERN011:
            return (t + n) % 3 == 0;
        case QRMaskPattern.PATTERN100:
            return (Math.floor(t / 2) + Math.floor(n / 3)) % 2 == 0;
        case QRMaskPattern.PATTERN101:
            return t * n % 2 + t * n % 3 == 0;
        case QRMaskPattern.PATTERN110:
            return (t * n % 2 + t * n % 3) % 2 == 0;
        case QRMaskPattern.PATTERN111:
            return (t * n % 3 + (t + n) % 2) % 2 == 0;
        default:
            throw new Error("bad maskPattern:" + e)
        }
    },
    getErrorCorrectPolynomial: function(e) {
        var t = new QRPolynomial([1],0);
        for (var n = 0; n < e; n++) {
            t = t.multiply(new QRPolynomial([1, QRMath.gexp(n)],0))
        }
        return t
    },
    getLengthInBits: function(e, t) {
        if (1 <= t && t < 10) {
            switch (e) {
            case QRMode.MODE_NUMBER:
                return 10;
            case QRMode.MODE_ALPHA_NUM:
                return 9;
            case QRMode.MODE_8BIT_BYTE:
                return 8;
            case QRMode.MODE_KANJI:
                return 8;
            default:
                throw new Error("mode:" + e)
            }
        } else if (t < 27) {
            switch (e) {
            case QRMode.MODE_NUMBER:
                return 12;
            case QRMode.MODE_ALPHA_NUM:
                return 11;
            case QRMode.MODE_8BIT_BYTE:
                return 16;
            case QRMode.MODE_KANJI:
                return 10;
            default:
                throw new Error("mode:" + e)
            }
        } else if (t < 41) {
            switch (e) {
            case QRMode.MODE_NUMBER:
                return 14;
            case QRMode.MODE_ALPHA_NUM:
                return 13;
            case QRMode.MODE_8BIT_BYTE:
                return 16;
            case QRMode.MODE_KANJI:
                return 12;
            default:
                throw new Error("mode:" + e)
            }
        } else {
            throw new Error("type:" + t)
        }
    },
    getLostPoint: function(e) {
        var t = e.getModuleCount();
        var n = 0;
        for (var r = 0; r < t; r++) {
            for (var i = 0; i < t; i++) {
                var s = 0;
                var o = e.isDark(r, i);
                for (var u = -1; u <= 1; u++) {
                    if (r + u < 0 || t <= r + u) {
                        continue
                    }
                    for (var a = -1; a <= 1; a++) {
                        if (i + a < 0 || t <= i + a) {
                            continue
                        }
                        if (u == 0 && a == 0) {
                            continue
                        }
                        if (o == e.isDark(r + u, i + a)) {
                            s++
                        }
                    }
                }
                if (s > 5) {
                    n += 3 + s - 5
                }
            }
        }
        for (var r = 0; r < t - 1; r++) {
            for (var i = 0; i < t - 1; i++) {
                var f = 0;
                if (e.isDark(r, i))
                    f++;
                if (e.isDark(r + 1, i))
                    f++;
                if (e.isDark(r, i + 1))
                    f++;
                if (e.isDark(r + 1, i + 1))
                    f++;
                if (f == 0 || f == 4) {
                    n += 3
                }
            }
        }
        for (var r = 0; r < t; r++) {
            for (var i = 0; i < t - 6; i++) {
                if (e.isDark(r, i) && !e.isDark(r, i + 1) && e.isDark(r, i + 2) && e.isDark(r, i + 3) && e.isDark(r, i + 4) && !e.isDark(r, i + 5) && e.isDark(r, i + 6)) {
                    n += 40
                }
            }
        }
        for (var i = 0; i < t; i++) {
            for (var r = 0; r < t - 6; r++) {
                if (e.isDark(r, i) && !e.isDark(r + 1, i) && e.isDark(r + 2, i) && e.isDark(r + 3, i) && e.isDark(r + 4, i) && !e.isDark(r + 5, i) && e.isDark(r + 6, i)) {
                    n += 40
                }
            }
        }
        var l = 0;
        for (var i = 0; i < t; i++) {
            for (var r = 0; r < t; r++) {
                if (e.isDark(r, i)) {
                    l++
                }
            }
        }
        var c = Math.abs(100 * l / t / t - 50) / 5;
        n += c * 10;
        return n
    }
};
var QRMath = {
    glog: function(e) {
        if (e < 1) {
            throw new Error("glog(" + e + ")")
        }
        return QRMath.LOG_TABLE[e]
    },
    gexp: function(e) {
        while (e < 0) {
            e += 255
        }
        while (e >= 256) {
            e -= 255
        }
        return QRMath.EXP_TABLE[e]
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256)
};
for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i
}
for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8]
}
for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i
}
QRPolynomial.prototype = {
    get: function(e) {
        return this.num[e]
    },
    getLength: function() {
        return this.num.length
    },
    multiply: function(e) {
        var t = new Array(this.getLength() + e.getLength() - 1);
        for (var n = 0; n < this.getLength(); n++) {
            for (var r = 0; r < e.getLength(); r++) {
                t[n + r] ^= QRMath.gexp(QRMath.glog(this.get(n)) + QRMath.glog(e.get(r)))
            }
        }
        return new QRPolynomial(t,0)
    },
    mod: function(e) {
        if (this.getLength() - e.getLength() < 0) {
            return this
        }
        var t = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
        var n = new Array(this.getLength());
        for (var r = 0; r < this.getLength(); r++) {
            n[r] = this.get(r)
        }
        for (var r = 0; r < e.getLength(); r++) {
            n[r] ^= QRMath.gexp(QRMath.glog(e.get(r)) + t)
        }
        return (new QRPolynomial(n,0)).mod(e)
    }
};
QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
QRRSBlock.getRSBlocks = function(e, t) {
    var n = QRRSBlock.getRsBlockTable(e, t);
    if (n == undefined) {
        throw new Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t)
    }
    var r = n.length / 3;
    var i = new Array;
    for (var s = 0; s < r; s++) {
        var o = n[s * 3 + 0];
        var u = n[s * 3 + 1];
        var a = n[s * 3 + 2];
        for (var f = 0; f < o; f++) {
            i.push(new QRRSBlock(u,a))
        }
    }
    return i
}
;
QRRSBlock.getRsBlockTable = function(e, t) {
    switch (t) {
    case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[(e - 1) * 4 + 0];
    case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[(e - 1) * 4 + 1];
    case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[(e - 1) * 4 + 2];
    case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[(e - 1) * 4 + 3];
    default:
        return undefined
    }
}
;
QRBitBuffer.prototype = {
    get: function(e) {
        var t = Math.floor(e / 8);
        return (this.buffer[t] >>> 7 - e % 8 & 1) == 1
    },
    put: function(e, t) {
        for (var n = 0; n < t; n++) {
            this.putBit((e >>> t - n - 1 & 1) == 1)
        }
    },
    getLengthInBits: function() {
        return this.length
    },
    putBit: function(e) {
        var t = Math.floor(this.length / 8);
        if (this.buffer.length <= t) {
            this.buffer.push(0)
        }
        if (e) {
            this.buffer[t] |= 128 >>> this.length % 8
        }
        this.length++
    }
}
