(()=>{var e={176:(e,t,s)=>{const{Chess:r}=s(938),o=s(627),i=s(78);class n{constructor(e,t){this.id=e,this.WorB=t,this.requiresVerbose=!0}selectMove(e,t){return null}}var h={random:class extends n{constructor(e,t){super(e,t),this.requiresVerbose=!1}selectMove(e,t){return t[Math.floor(Math.random()*t.length)]}},alwaysTake:class extends n{constructor(e,t){super(e,t),this.requiresVerbose=!0}selectMove(e,t){for(let o=0;o<t.length;o++){const i=t[o];if((s=new r(e.fen())).move(i),s.isCheckmate())return i}for(let s=0;s<t.length;s++){const r=t[s];if(0!=e.get(r.to))return r}for(let o=0;o<t.length;o++){const i=t[o];var s;if((s=new r(e.fen())).move(i),s.isCheck())return i}return t[Math.floor(Math.random()*t.length)]}},greedy:class extends n{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.boardsGenerated=0}selectMove(e,t){var s="b";this.WorB&&(s="w");var i=null,n=-1;for(let a=0;a<t.length;a++){var h=new r(e.fen());this.boardsGenerated+=1;const l=t[a];h.move(l);const c=o.pieceValue(h,s);c>n&&(i=l,n=c)}return i}},MCTS:class extends n{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.turn=t?1:2}selectMove(e,t){return i.getNewNode(e,null),t[Math.floor(Math.random()*t.length)]}}};t.getAgent=function(e,t,s){const r=Object.keys(h);for(var o=0;o<r.length;o++)if(r[o]===e)return new h[e](t,s);return null}},627:(e,t)=>{const s=["a","b","c","d","e","f","g","h"],r={p:1,n:3.05,b:3.33,r:5.63,q:9.5,k:0};t.evaluateBoard=function(e){var t=0;for(let e=0;e<1e3;e++)denominator=Math.random(),t+=denominator-.5;return t},t.pieceValue=function(e,t){var o=0,i=0,n=[];for(let h=0;h<s.length;h++)for(let a=1;a<s.length+1;a++)tile=s[h]+a,n.push(tile),piece=e.get(tile),0!=piece&&(piece.color===t?o+=r[piece.type]:i+=r[piece.type]);return(o+Number.EPSILON)/(o+i+Number.EPSILON)}},73:(e,t,s)=>{var r=new(s(938).Chess);t.runGame=function(e,t,s){r.reset();for(var o=0;;){if(s&&console.log(r.fen()),r.isGameOver())return r.isCheck()?t:null;var i;i=e.requiresVerbose?r.moves({verbose:!0}):r.moves();const h=e.selectMove(r,i);if(r.move(h),o++,s&&console.log(r.fen()),r.isGameOver())return r.isCheck()?e:null;var n;n=t.requiresVerbose?r.moves({verbose:!0}):r.moves();const a=t.selectMove(r,n);r.move(a),o++}console.log("game length: "+o);const h=r.moves();console.log(e.selectMove("boardPlaceholder",h))}},78:(e,t)=>{var s=-1;class r{constructor(e,t,s){}}t.getNewNode=function(e,t){return new r(s+=1,e,t)}},938:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Chess=t.validateFen=t.SQUARES=t.DEFAULT_POSITION=t.KING=t.QUEEN=t.ROOK=t.BISHOP=t.KNIGHT=t.PAWN=t.BLACK=t.WHITE=void 0,t.WHITE="w",t.BLACK="b",t.PAWN="p",t.KNIGHT="n",t.BISHOP="b",t.ROOK="r",t.QUEEN="q",t.KING="k",t.DEFAULT_POSITION="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";const s=-1,r={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q"};t.SQUARES=["a8","b8","c8","d8","e8","f8","g8","h8","a7","b7","c7","d7","e7","f7","g7","h7","a6","b6","c6","d6","e6","f6","g6","h6","a5","b5","c5","d5","e5","f5","g5","h5","a4","b4","c4","d4","e4","f4","g4","h4","a3","b3","c3","d3","e3","f3","g3","h3","a2","b2","c2","d2","e2","f2","g2","h2","a1","b1","c1","d1","e1","f1","g1","h1"];const o={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64},i={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},n={b:[16,32,17,15],w:[-16,-32,-17,-15]},h={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},a=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],l=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],c={p:1,n:2,b:4,r:8,q:16,k:32},u=[t.KNIGHT,t.BISHOP,t.ROOK,t.QUEEN],f={w:[{square:i.a1,flag:o.QSIDE_CASTLE},{square:i.h1,flag:o.KSIDE_CASTLE}],b:[{square:i.a8,flag:o.QSIDE_CASTLE},{square:i.h8,flag:o.KSIDE_CASTLE}]},_={b:1,w:6},d=["1-0","0-1","1/2-1/2","*"];function p(e){return e>>4}function g(e){return 15&e}function m(e){return-1!=="0123456789".indexOf(e)}function b(e){const t=g(e),s=p(e);return"abcdefgh".substring(t,t+1)+"87654321".substring(s,s+1)}function v(e){return e===t.WHITE?t.BLACK:t.WHITE}function E(e){const t=[];t[0]="No errors.",t[1]="FEN string must contain six space-delimited fields.",t[2]="6th field (move number) must be a positive integer.",t[3]="5th field (half move counter) must be a non-negative integer.",t[4]="4th field (en-passant square) is invalid.",t[5]="3rd field (castling availability) is invalid.",t[6]="2nd field (side to move) is invalid.",t[7]="1st field (piece positions) does not contain 8 '/'-delimited rows.",t[8]="1st field (piece positions) is invalid [consecutive numbers].",t[9]="1st field (piece positions) is invalid [invalid piece].",t[10]="1st field (piece positions) is invalid [row too large].",t[11]="Illegal en-passant square";const s=e.split(/\s+/);if(6!==s.length)return{valid:!1,errorNumber:1,error:t[1]};const r=parseInt(s[5],10);if(isNaN(r)||r<=0)return{valid:!1,errorNumber:2,error:t[2]};const o=parseInt(s[4],10);if(isNaN(o)||o<0)return{valid:!1,errorNumber:3,error:t[3]};if(!/^(-|[abcdefgh][36])$/.test(s[3]))return{valid:!1,errorNumber:4,error:t[4]};if(!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(s[2]))return{valid:!1,errorNumber:5,error:t[5]};if(!/^(w|b)$/.test(s[1]))return{valid:!1,errorNumber:6,error:t[6]};const i=s[0].split("/");if(8!==i.length)return{valid:!1,errorNumber:7,error:t[7]};for(let e=0;e<i.length;e++){let s=0,r=!1;for(let o=0;o<i[e].length;o++)if(m(i[e][o])){if(r)return{valid:!1,errorNumber:8,error:t[8]};s+=parseInt(i[e][o],10),r=!0}else{if(!/^[prnbqkPRNBQK]$/.test(i[e][o]))return{valid:!1,errorNumber:9,error:t[9]};s+=1,r=!1}if(8!==s)return{valid:!1,errorNumber:10,error:t[10]}}return"3"==s[3][1]&&"w"==s[1]||"6"==s[3][1]&&"b"==s[1]?{valid:!1,errorNumber:11,error:t[11]}:{valid:!0,errorNumber:0,error:t[0]}}function S(e,s,r,i,n,h,a=o.NORMAL){const l=p(i);if(n!==t.PAWN||7!==l&&0!==l)e.push({color:s,from:r,to:i,piece:n,captured:h,promotion:void 0,flags:a});else for(let t=0;t<u.length;t++){const l=u[t];e.push({color:s,from:r,to:i,piece:n,captured:h,promotion:l,flags:a|o.PROMOTION})}}function C(e){let s=e.charAt(0);if(s>="a"&&s<="h"){if(e.match(/[a-h]\d.*[a-h]\d/))return;return t.PAWN}return s=s.toLowerCase(),"o"===s?t.KING:s}function N(e){return e.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}t.validateFen=E,t.Chess=class{constructor(e=t.DEFAULT_POSITION){this._board=new Array(128),this._turn=t.WHITE,this._header={},this._kings={w:s,b:s},this._epSquare=-1,this._halfMoves=0,this._moveNumber=0,this._history=[],this._comments={},this._castling={w:0,b:0},this.load(e)}clear(e=!1){this._board=new Array(128),this._kings={w:s,b:s},this._turn=t.WHITE,this._castling={w:0,b:0},this._epSquare=s,this._halfMoves=0,this._moveNumber=1,this._history=[],this._comments={},this._header=e?this._header:{},this._updateSetup(this.fen())}load(e,r=!1){const n=e.split(/\s+/),h=n[0];let a=0;if(!E(e).valid)return!1;this.clear(r);for(let e=0;e<h.length;e++){const s=h.charAt(e);if("/"===s)a+=8;else if(m(s))a+=parseInt(s,10);else{const e=s<"a"?t.WHITE:t.BLACK;this.put({type:s.toLowerCase(),color:e},b(a)),a++}}return this._turn=n[1],n[2].indexOf("K")>-1&&(this._castling.w|=o.KSIDE_CASTLE),n[2].indexOf("Q")>-1&&(this._castling.w|=o.QSIDE_CASTLE),n[2].indexOf("k")>-1&&(this._castling.b|=o.KSIDE_CASTLE),n[2].indexOf("q")>-1&&(this._castling.b|=o.QSIDE_CASTLE),this._epSquare="-"===n[3]?s:i[n[3]],this._halfMoves=parseInt(n[4],10),this._moveNumber=parseInt(n[5],10),this._updateSetup(this.fen()),!0}fen(){let e=0,r="";for(let s=i.a8;s<=i.h1;s++){if(this._board[s]){e>0&&(r+=e,e=0);const{color:o,type:i}=this._board[s];r+=o===t.WHITE?i.toUpperCase():i.toLowerCase()}else e++;s+1&136&&(e>0&&(r+=e),s!==i.h1&&(r+="/"),e=0,s+=8)}let n="";this._castling[t.WHITE]&o.KSIDE_CASTLE&&(n+="K"),this._castling[t.WHITE]&o.QSIDE_CASTLE&&(n+="Q"),this._castling[t.BLACK]&o.KSIDE_CASTLE&&(n+="k"),this._castling[t.BLACK]&o.QSIDE_CASTLE&&(n+="q"),n=n||"-";const h=this._epSquare===s?"-":b(this._epSquare);return[r,this._turn,n,h,this._halfMoves,this._moveNumber].join(" ")}_updateSetup(e){this._history.length>0||(e!==t.DEFAULT_POSITION?(this._header.SetUp="1",this._header.FEN=e):(delete this._header.SetUp,delete this._header.FEN))}reset(){this.load(t.DEFAULT_POSITION)}get(e){return this._board[i[e]]||!1}put({type:e,color:r},o){if(-1==="pnbrqkPNBRQK".indexOf(e.toLowerCase()))return!1;if(!(o in i))return!1;const n=i[o];return(e!=t.KING||this._kings[r]==s||this._kings[r]==n)&&(this._board[n]={type:e,color:r},e===t.KING&&(this._kings[r]=n),this._updateSetup(this.fen()),!0)}remove(e){const r=this.get(e);return delete this._board[i[e]],r&&r.type===t.KING&&(this._kings[r.color]=s),this._updateSetup(this.fen()),r}_attacked(e,s){for(let r=i.a8;r<=i.h1;r++){if(136&r){r+=7;continue}if(void 0===this._board[r]||this._board[r].color!==e)continue;const o=this._board[r],i=r-s,n=i+119;if(a[n]&c[o.type]){if(o.type===t.PAWN){if(i>0){if(o.color===t.WHITE)return!0}else if(o.color===t.BLACK)return!0;continue}if("n"===o.type||"k"===o.type)return!0;const e=l[n];let h=r+e,a=!1;for(;h!==s;){if(null!=this._board[h]){a=!0;break}h+=e}if(!a)return!0}}return!1}_isKingAttacked(e){return this._attacked(v(e),this._kings[e])}isCheck(){return this._isKingAttacked(this._turn)}inCheck(){return this.isCheck()}isCheckmate(){return this.isCheck()&&0===this._moves().length}isStalemate(){return!this.isCheck()&&0===this._moves().length}isInsufficientMaterial(){const e={b:0,n:0,r:0,q:0,k:0,p:0},s=[];let r=0,o=0;for(let n=i.a8;n<=i.h1;n++){if(o=(o+1)%2,136&n){n+=7;continue}const i=this._board[n];i&&(e[i.type]=i.type in e?e[i.type]+1:1,i.type===t.BISHOP&&s.push(o),r++)}if(2===r)return!0;if(3===r&&(1===e[t.BISHOP]||1===e[t.KNIGHT]))return!0;if(r===e[t.BISHOP]+2){let e=0;const t=s.length;for(let r=0;r<t;r++)e+=s[r];if(0===e||e===t)return!0}return!1}isThreefoldRepetition(){const e=[],t={};let s=!1;for(;;){const t=this._undoMove();if(!t)break;e.push(t)}for(;;){const r=this.fen().split(" ").slice(0,4).join(" ");t[r]=r in t?t[r]+1:1,t[r]>=3&&(s=!0);const o=e.pop();if(!o)break;this._makeMove(o)}return s}isDraw(){return this._halfMoves>=100||this.isStalemate()||this.isInsufficientMaterial()||this.isThreefoldRepetition()}isGameOver(){return this.isCheckmate()||this.isStalemate()||this.isDraw()}moves({verbose:e=!1,square:t}={}){const s=this._moves({square:t});return e?s.map((e=>this._makePretty(e))):s.map((e=>this._moveToSan(e,s)))}_moves({legal:e=!0,piece:s,square:r}={}){var a;const l=r?r.toLowerCase():void 0,c=null==s?void 0:s.toLowerCase(),u=[],f=this._turn,d=v(f);let g=i.a8,m=i.h1,b=!1;if(l){if(!(l in i))return[];g=m=i[l],b=!0}for(let e=g;e<=m;e++){if(136&e){e+=7;continue}if(!this._board[e]||this._board[e].color===d)continue;const{type:s}=this._board[e];let r;if(s===t.PAWN){if(c&&c!==s)continue;r=e+n[f][0],this._board[r]||(S(u,f,e,r,t.PAWN),r=e+n[f][1],_[f]!==p(e)||this._board[r]||S(u,f,e,r,t.PAWN,void 0,o.BIG_PAWN));for(let s=2;s<4;s++)r=e+n[f][s],136&r||((null===(a=this._board[r])||void 0===a?void 0:a.color)===d?S(u,f,e,r,t.PAWN,this._board[r].type,o.CAPTURE):r===this._epSquare&&S(u,f,e,r,t.PAWN,t.PAWN,o.EP_CAPTURE))}else{if(c&&c!==s)continue;for(let i=0,n=h[s].length;i<n;i++){const n=h[s][i];for(r=e;r+=n,!(136&r);){if(this._board[r]){if(this._board[r].color===f)break;S(u,f,e,r,s,this._board[r].type,o.CAPTURE);break}if(S(u,f,e,r,s),s===t.KNIGHT||s===t.KING)break}}}}if(!(void 0!==c&&c!==t.KING||b&&m!==this._kings[f])){if(this._castling[f]&o.KSIDE_CASTLE){const e=this._kings[f],s=e+2;this._board[e+1]||this._board[s]||this._attacked(d,this._kings[f])||this._attacked(d,e+1)||this._attacked(d,s)||S(u,f,this._kings[f],s,t.KING,void 0,o.KSIDE_CASTLE)}if(this._castling[f]&o.QSIDE_CASTLE){const e=this._kings[f],s=e-2;this._board[e-1]||this._board[e-2]||this._board[e-3]||this._attacked(d,this._kings[f])||this._attacked(d,e-1)||this._attacked(d,s)||S(u,f,this._kings[f],s,t.KING,void 0,o.QSIDE_CASTLE)}}if(!e)return u;const E=[];for(let e=0,t=u.length;e<t;e++)this._makeMove(u[e]),this._isKingAttacked(f)||E.push(u[e]),this._undoMove();return E}move(e,{sloppy:t=!1}={}){let s=null;if("string"==typeof e)s=this._moveFromSan(e,t);else if("object"==typeof e){const t=this._moves();for(let r=0,o=t.length;r<o;r++)if(e.from===b(t[r].from)&&e.to===b(t[r].to)&&(!("promotion"in t[r])||e.promotion===t[r].promotion)){s=t[r];break}}if(!s)return null;const r=this._makePretty(s);return this._makeMove(s),r}_push(e){this._history.push({move:e,kings:{b:this._kings.b,w:this._kings.w},turn:this._turn,castling:{b:this._castling.b,w:this._castling.w},epSquare:this._epSquare,halfMoves:this._halfMoves,moveNumber:this._moveNumber})}_makeMove(e){const r=this._turn,i=v(r);if(this._push(e),this._board[e.to]=this._board[e.from],delete this._board[e.from],e.flags&o.EP_CAPTURE&&(this._turn===t.BLACK?delete this._board[e.to-16]:delete this._board[e.to+16]),e.promotion&&(this._board[e.to]={type:e.promotion,color:r}),this._board[e.to].type===t.KING){if(this._kings[r]=e.to,e.flags&o.KSIDE_CASTLE){const t=e.to-1,s=e.to+1;this._board[t]=this._board[s],delete this._board[s]}else if(e.flags&o.QSIDE_CASTLE){const t=e.to+1,s=e.to-2;this._board[t]=this._board[s],delete this._board[s]}this._castling[r]=0}if(this._castling[r])for(let t=0,s=f[r].length;t<s;t++)if(e.from===f[r][t].square&&this._castling[r]&f[r][t].flag){this._castling[r]^=f[r][t].flag;break}if(this._castling[i])for(let t=0,s=f[i].length;t<s;t++)if(e.to===f[i][t].square&&this._castling[i]&f[i][t].flag){this._castling[i]^=f[i][t].flag;break}e.flags&o.BIG_PAWN?r===t.BLACK?this._epSquare=e.to-16:this._epSquare=e.to+16:this._epSquare=s,e.piece===t.PAWN||e.flags&(o.CAPTURE|o.EP_CAPTURE)?this._halfMoves=0:this._halfMoves++,r===t.BLACK&&this._moveNumber++,this._turn=i}undo(){const e=this._undoMove();return e?this._makePretty(e):null}_undoMove(){const e=this._history.pop();if(void 0===e)return null;const s=e.move;this._kings=e.kings,this._turn=e.turn,this._castling=e.castling,this._epSquare=e.epSquare,this._halfMoves=e.halfMoves,this._moveNumber=e.moveNumber;const r=this._turn,i=v(r);if(this._board[s.from]=this._board[s.to],this._board[s.from].type=s.piece,delete this._board[s.to],s.captured)if(s.flags&o.EP_CAPTURE){let e;e=r===t.BLACK?s.to-16:s.to+16,this._board[e]={type:t.PAWN,color:i}}else this._board[s.to]={type:s.captured,color:i};if(s.flags&(o.KSIDE_CASTLE|o.QSIDE_CASTLE)){let e,t;s.flags&o.KSIDE_CASTLE?(e=s.to+1,t=s.to-1):(e=s.to-2,t=s.to+1),this._board[e]=this._board[t],delete this._board[t]}return s}pgn({newline:e="\n",maxWidth:t=0}={}){const s=[];let r=!1;for(const t in this._header)s.push("["+t+' "'+this._header[t]+'"]'+e),r=!0;r&&this._history.length&&s.push(e);const o=e=>{const t=this._comments[this.fen()];return void 0!==t&&(e=`${e}${e.length>0?" ":""}{${t}}`),e},i=[];for(;this._history.length>0;)i.push(this._undoMove());const n=[];let h="";for(0===i.length&&n.push(o(""));i.length>0;){h=o(h);const e=i.pop();if(!e)break;if(this._history.length||"b"!==e.color)"w"===e.color&&(h.length&&n.push(h),h=this._moveNumber+".");else{const e=`${this._moveNumber}. ...`;h=h?`${h} ${e}`:e}h=h+" "+this._moveToSan(e,this._moves({legal:!0})),this._makeMove(e)}if(h.length&&n.push(o(h)),void 0!==this._header.Result&&n.push(this._header.Result),0===t)return s.join("")+n.join(" ");const a=function(){return s.length>0&&" "===s[s.length-1]&&(s.pop(),!0)},l=function(r,o){for(const i of o.split(" "))if(i){if(r+i.length>t){for(;a();)r--;s.push(e),r=0}s.push(i),r+=i.length,s.push(" "),r++}return a()&&r--,r};let c=0;for(let r=0;r<n.length;r++)c+n[r].length>t&&n[r].includes("{")?c=l(c,n[r]):(c+n[r].length>t&&0!==r?(" "===s[s.length-1]&&s.pop(),s.push(e),c=0):0!==r&&(s.push(" "),c++),s.push(n[r]),c+=n[r].length);return s.join("")}header(...e){for(let t=0;t<e.length;t+=2)"string"==typeof e[t]&&"string"==typeof e[t+1]&&(this._header[e[t]]=e[t+1]);return this._header}loadPgn(e,{sloppy:t=!1,newlineChar:s="\r?\n"}={}){function r(e){return e.replace(/\\/g,"\\")}e=e.trim();const o=new RegExp("^(\\[((?:"+r(s)+")|.)*\\])(?:\\s*"+r(s)+"){2}").exec(e),i=o&&o.length>=2?o[1]:"";this.reset();const n=function(e){const t={},o=e.split(new RegExp(r(s)));let i="",n="";for(let e=0;e<o.length;e++){const s=/^\s*\[([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;i=o[e].replace(s,"$1"),n=o[e].replace(s,"$2"),i.trim().length>0&&(t[i]=n)}return t}(i);let h="";for(const e in n)"fen"===e.toLowerCase()&&(h=n[e]),this.header(e,n[e]);if(t){if(h&&!this.load(h,!0))return!1}else if(!("1"!==n.SetUp||"FEN"in n&&this.load(n.FEN,!0)))return!1;const a=function(e){return`{${function(e){return Array.from(e).map((function(e){return e.charCodeAt(0)<128?e.charCodeAt(0).toString(16):encodeURIComponent(e).replace(/%/g,"").toLowerCase()})).join("")}((e=e.replace(new RegExp(r(s),"g")," ")).slice(1,e.length-1))}}`},l=function(e){if(e.startsWith("{")&&e.endsWith("}"))return function(e){return 0==e.length?"":decodeURIComponent("%"+(e.match(/.{1,2}/g)||[]).join("%"))}(e.slice(1,e.length-1))};let c=e.replace(i,"").replace(new RegExp(`({[^}]*})+?|;([^${r(s)}]*)`,"g"),(function(e,t,s){return void 0!==t?a(t):" "+a(`{${s.slice(1)}}`)})).replace(new RegExp(r(s),"g")," ");const u=/(\([^()]+\))+?/g;for(;u.test(c);)c=c.replace(u,"");c=c.replace(/\d+\.(\.\.)?/g,""),c=c.replace(/\.\.\./g,""),c=c.replace(/\$\d+/g,"");let f=c.trim().split(new RegExp(/\s+/));f=f.join(",").replace(/,,+/g,",").split(",");let _="";for(let e=0;e<f.length;e++){const s=l(f[e]);if(void 0!==s){this._comments[this.fen()]=s;continue}const r=this._moveFromSan(f[e],t);if(null==r){if(!(d.indexOf(f[e])>-1))return!1;_=f[e]}else _="",this._makeMove(r)}return _&&Object.keys(this._header).length&&!this._header.Result&&this.header("Result",_),!0}_moveToSan(e,s){let r="";if(e.flags&o.KSIDE_CASTLE)r="O-O";else if(e.flags&o.QSIDE_CASTLE)r="O-O-O";else{if(e.piece!==t.PAWN){const t=function(e,t){const s=e.from,r=e.to,o=e.piece;let i=0,n=0,h=0;for(let e=0,a=t.length;e<a;e++){const a=t[e].from,l=t[e].to;o===t[e].piece&&s!==a&&r===l&&(i++,p(s)===p(a)&&n++,g(s)===g(a)&&h++)}return i>0?n>0&&h>0?b(s):h>0?b(s).charAt(1):b(s).charAt(0):""}(e,s);r+=e.piece.toUpperCase()+t}e.flags&(o.CAPTURE|o.EP_CAPTURE)&&(e.piece===t.PAWN&&(r+=b(e.from)[0]),r+="x"),r+=b(e.to),e.promotion&&(r+="="+e.promotion.toUpperCase())}return this._makeMove(e),this.isCheck()&&(this.isCheckmate()?r+="#":r+="+"),this._undoMove(),r}_moveFromSan(e,t=!1){const s=N(e);let r,o,n,h,a,l=C(s),c=this._moves({legal:!0,piece:l});for(let e=0,t=c.length;e<t;e++)if(s===N(this._moveToSan(c[e],c)))return c[e];if(!t)return null;let u=!1;o=s.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/),o?(r=o[1],n=o[2],h=o[3],a=o[4],1==n.length&&(u=!0)):(o=s.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/),o&&(r=o[1],n=o[2],h=o[3],a=o[4],1==n.length&&(u=!0))),l=C(s),c=this._moves({legal:!0,piece:r||l});for(let e=0,t=c.length;e<t;e++)if(n&&h){if(!(r&&r.toLowerCase()!=c[e].piece||i[n]!=c[e].from||i[h]!=c[e].to||a&&a.toLowerCase()!=c[e].promotion))return c[e];if(u){const t=b(c[e].from);if(!(r&&r.toLowerCase()!=c[e].piece||i[h]!=c[e].to||n!=t[0]&&n!=t[1]||a&&a.toLowerCase()!=c[e].promotion))return c[e]}}return null}ascii(){let e="   +------------------------+\n";for(let s=i.a8;s<=i.h1;s++){if(0===g(s)&&(e+=" "+"87654321"[p(s)]+" |"),this._board[s]){const r=this._board[s].type;e+=" "+(this._board[s].color===t.WHITE?r.toUpperCase():r.toLowerCase())+" "}else e+=" . ";s+1&136&&(e+="|\n",s+=8)}return e+="   +------------------------+\n",e+="     a  b  c  d  e  f  g  h",e}perft(e){const t=this._moves({legal:!1});let s=0;const r=this._turn;for(let o=0,i=t.length;o<i;o++)this._makeMove(t[o]),this._isKingAttacked(r)||(e-1>0?s+=this.perft(e-1):s++),this._undoMove();return s}_makePretty(e){const{color:t,piece:s,from:i,to:n,flags:h,captured:a,promotion:l}=e;let c="";for(const e in o)o[e]&h&&(c+=r[e]);const u={color:t,piece:s,from:b(i),to:b(n),san:this._moveToSan(e,this._moves({legal:!0})),flags:c};return a&&(u.captured=a),l&&(u.promotion=l),u}turn(){return this._turn}board(){const e=[];let t=[];for(let s=i.a8;s<=i.h1;s++)null==this._board[s]?t.push(null):t.push({square:b(s),type:this._board[s].type,color:this._board[s].color}),s+1&136&&(e.push(t),t=[],s+=8);return e}squareColor(e){if(e in i){const t=i[e];return(p(t)+g(t))%2==0?"light":"dark"}return null}history({verbose:e=!1}={}){const t=[],s=[];for(;this._history.length>0;)t.push(this._undoMove());for(;;){const r=t.pop();if(!r)break;e?s.push(this._makePretty(r)):s.push(this._moveToSan(r,this._moves())),this._makeMove(r)}return s}_pruneComments(){const e=[],t={},s=e=>{e in this._comments&&(t[e]=this._comments[e])};for(;this._history.length>0;)e.push(this._undoMove());for(s(this.fen());;){const t=e.pop();if(!t)break;this._makeMove(t),s(this.fen())}this._comments=t}getComment(){return this._comments[this.fen()]}setComment(e){this._comments[this.fen()]=e.replace("{","[").replace("}","]")}deleteComment(){const e=this._comments[this.fen()];return delete this._comments[this.fen()],e}getComments(){return this._pruneComments(),Object.keys(this._comments).map((e=>({fen:e,comment:this._comments[e]})))}deleteComments(){return this._pruneComments(),Object.keys(this._comments).map((e=>{const t=this._comments[e];return delete this._comments[e],{fen:e,comment:t}}))}}}},t={};function s(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,s),i.exports}(()=>{board=Chessboard("myBoard","start");var e=s(176),t=document.getElementById("CompVComp"),r=document.getElementById("startButton");t.addEventListener("click",(function(){!function(){const t=e.getAgent("MCTS",1,!0),r=e.getAgent("random",2,!1);agent1Wins=0,agent2Wins=0,draws=0;for(let e=0;e<5;e++){const e=s(73).runGame(t,r,!1);null!=e?(result="Player "+e.id+" Wins",1===e.id?agent1Wins+=1:agent2Wins+=1):(result="Draw",draws+=1),console.log(result)}const o=agent1Wins+agent2Wins+draws,i=Math.pow(10,2);console.log("\nGames Played  :  "+o),console.log("Agent "+t.id+"       :  "+agent1Wins+" ("+Math.round((100*agent1Wins/o+Number.EPSILON)*i)/i+" %)"),console.log("Agent "+r.id+"       :  "+agent2Wins+" ("+Math.round((100*agent2Wins/o+Number.EPSILON)*i)/i+" %)"),console.log("Draws         :  "+draws+" ("+Math.round((100*draws/o+Number.EPSILON)*i)/i+" %)"),console.log("")}()}),!1),r.addEventListener("click",(function(){console.log("Starting game"),e.getAgent("MCTS",1,!0),e.getAgent("random",2,!1)}),!1)})()})();