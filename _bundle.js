(()=>{var e={176:(e,t,i)=>{const{Chess:o}=i(938),s=i(627),r=i(78);function n(e){return e>=0&&e<=1?1-e:null}class l{constructor(e,t){this.id=e,this.WorB=t,this.requiresVerbose=!0,this.requiresLastPlayerMove=!1,this.offlineTreeBuilding=!1,this.hasTimeLimit=!1}selectMove(e,t){return null}}class a extends l{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.boardsGenerated=0}selectMove(e,t){var i="b";this.WorB&&(i="w");var r=null,n=-1;for(let a=0;a<t.length;a++){var l=new o(e.fen());this.boardsGenerated+=1;const h=t[a];l.move(h);const c=s.NN(l,i,null,0);console.log("wercwercw"),c>n&&(r=h,n=c)}return r}}var h={random:class extends l{constructor(e,t){super(e,t),this.requiresVerbose=!1}selectMove(e,t){return t[Math.floor(Math.random()*t.length)]}},alwaysTake:class extends l{constructor(e,t){super(e,t),this.requiresVerbose=!0}selectMove(e,t){for(let s=0;s<t.length;s++){const r=t[s];if((i=new o(e.fen())).move(r),i.isCheckmate())return r}for(let i=0;i<t.length;i++){const o=t[i];if(0!=e.get(o.to))return o}for(let s=0;s<t.length;s++){const r=t[s];var i;if((i=new o(e.fen())).move(r),i.isCheck())return r}return t[Math.floor(Math.random()*t.length)]}},greedy:a,MCTS:class extends l{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.rootNode=null,this.rootID=-1,this.allExpandedNodes=[],this.requiresLastPlayerMove=!0,this.offlineTreeBuilding=!0,this.timeLimit=1,this.hasTimeLimit=!0,this.MIN_ROUNDS=10,this.playerAvailableMoves=null,this.playerBoardState=null,this.MAX_PATH_LENGTH=1e3,this.turn=t?1:2}setTimeLimit(e){this.timeLimit=e}nodeVisited(e){for(let t=0;t<this.allExpandedNodes.length;t++)if(e===this.allExpandedNodes[t])return!0;return!1}offlineImproveTree(){this.improveTree(!0)}improveTree(e){var t=this.rootNode;e&&(t.fullyExplored()||t.expand(),t=this.rootNode.bandit(.3));var i=[t],o=t;o.visits++;for(var s=!0;o.fullyExplored();){if(o.hasNoMoves()){s=!1;break}if(i.length>this.MAX_PATH_LENGTH){s=!1;break}(o=o.bandit()).visits++,i.push(o)}var r=0;s&&(r=o.expand(this.WorB));var l=0,a=0;o.matchesAgentColor(this.WorB)?(a=n(r),l=r):(l=n(r),a=r);for(let e=i.length-2;e>=0;e--){var h=i[e];if(s||e!==i.length){var c=a;if(h.matchesAgentColor(this.WorB)&&(c=l),!(c>h.qValue))break;h.bestMoveObject=i[e+1].actionObject,h.updateNodeValue(c)}else console.log("No backprop here")}}selectMove(e,t){this.allExpandedNodes=[];var i=!1;if(null!=this.playerAvailableMoves)for(let t=0;t<this.playerAvailableMoves.length;t++){var s=this.playerAvailableMoves[t],l=new o(this.playerBoardState.board.fen());l.move(s.move),l.fen()===e.fen()&&null!=this.playerBoardState&&(this.rootNode=this.playerBoardState.childrenDict[s.id],i=!0)}null!==this.rootNode&&i?console.log("Found!"):(this.rootNode=r.getNewRoot(e,null,e.moves({verbose:!0}),this.WorB,null),console.log("Couldnt retrieve, giving new: "+this.rootNode.id)),this.turn++;var a=1e3*this.timeLimit;const h=Date.now();for(var c=0;Date.now()-h<a||c<this.MIN_ROUNDS;)c++,this.improveTree(!1);var u,d=null,f=-1,m=null,g=Object.keys(this.rootNode.moveObjects).length;for(let e=0;e<g;e++){var v=this.rootNode.moveObjects[e],p=this.rootNode.childrenDict[v.id];console.log("\nMove: "+v.move.to),console.log("Value: "+(u=n(p.qValue),4,Number(Math.round(u+"e4")+"e-4"))),console.log("Visits: "+p.visits),n(p.qValue)>f&&(d=v.move,f=n(p.qValue),m=p)}m.fullyExplored(),this.playerAvailableMoves=[];for(let e=0;e<m.moveObjects.length;e++)this.playerAvailableMoves.push(m.moveObjects[e]);return this.playerBoardState=m,this.rootNode=m,d}},LightMCTS:class extends l{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.rootNode=null,this.offlineTreeBuilding=!0,this.timeLimit=1,this.hasTimeLimit=!0,this.MIN_ROUNDS=100,this.testGame,this.playerMoves=null,this.previousBoard=null,this.OFFLINE_BATCH_SIZE=20}setTimeLimit(e){this.timeLimit=e}invertQvalue(e){return 1-e}offlineImproveTree(){for(let e=0;e<this.OFFLINE_BATCH_SIZE;e++)this.improveTree()}improveTree(){void 0===this.nodesGenerated?this.nodesGenerated=0:this.nodesGenerated++;let e=this.rootNode,t=[e];for(;e.visits>0;){let i=e.bandit();if(-1===i){console.log("Value: "+e.qValue),e.visit();break}e=i,t.push(e),this.testGame.move(e.action)}let i=-1;if(null!=e.parent&&(i=e.parent.qValue),!e.movesDiscoverd){e.discoverMoves(this.testGame.moves()),e.movesDiscoverd=!0,0===e.moves.length?this.testGame.isCheckmate()?e.setQValue(0):e.setQValue(.5):e.setQValue(s.getQValue(this.testGame,e.action,i,e.WorB));for(let e=t.length-1;e>=0;e--)if(this.testGame.undo(t[e].action),t[e].visit(),e<t.length-1){if(!(this.invertQvalue(t[e+1].qValue)>t[e].qValue)){for(let i=e-1;i>=0;i--)this.testGame.undo(t[i].action),t[i].visit();break}t[e].setQValue(this.invertQvalue(t[e+1].qValue))}}}selectMove(e,t){const i=Date.now();var s=0;let n=!0;if(null!=this.playerMoves||null!=this.previousBoard){let t=new o(this.previousBoard.fen());for(let i=0;i<this.playerMoves.length;i++)t.move(this.playerMoves[i]),t.fen()===e.fen()&&(this.rootNode=this.rootNode.children[this.playerMoves[i]],null!=this.rootNode&&(this.rootNode.board=e,n=!1)),t.undo(this.playerMoves[i])}for(n&&(this.rootNode=r.getLightNode(null,this.WorB,null,e)),this.testGame=new o(this.rootNode.board.fen()),this.nodesGenerated=0;Date.now()-i<1e3*this.timeLimit||s<this.MIN_ROUNDS;)s++,this.improveTree();let l=-1,a=null;var h=1;for(var c in console.log("\n--------------------------------"),this.rootNode.children)console.log("\nMove: "+c),console.log("Value: "+this.invertQvalue(this.rootNode.children[c].qValue)),console.log("Visits: "+this.rootNode.children[c].visits),h+=this.rootNode.children[c].visits,this.invertQvalue(this.rootNode.children[c].qValue)>l&&(a=c,l=this.invertQvalue(this.rootNode.children[c].qValue));return console.log("Count: "+this.nodesGenerated),console.log("Sum:   "+h),this.playerMoves=this.rootNode.children[a].moves,this.previousBoard=new o(this.rootNode.board.fen()),this.previousBoard.move(a),this.testGame=new o(this.previousBoard.fen()),this.rootNode=this.rootNode.children[a],this.rootNode.board=new o(this.previousBoard.fen()),a}},NNGreedy:a};t.getAgent=function(e,t,i){const o=Object.keys(h);for(let s=0;s<o.length;s++)if(o[s]===e)return new h[e](t,i);return null}},627:(e,t)=>{const i=["a","b","c","d","e","f","g","h"],o={p:1,n:3.05,b:3.33,r:5.63,q:9.5,k:0};var s=0;t.evaluateBoard=function(e){return-2},t.pieceValue=function(e,t,s,r){var n=!1;if(null!=s){stringSan=s.san.split("");for(let e=0;e<stringSan.length;e++)"x"===stringSan[e]&&(n=!0)}if(!n&&r>=0&&r<=1)return r;console.log(e.fen());var l=0,a=0,h=t,c=[];for(let t=0;t<i.length;t++)for(let s=1;s<i.length+1;s++)tile=i[t]+s,c.push(tile),piece=e.get(tile),0!=piece&&(piece.color===h?l+=o[piece.type]:a+=o[piece.type]);return console.log("ME: "+l+" them: "+a),(l+Number.EPSILON)/(l+a+Number.EPSILON)},t.getCount=function(){return s};var r=!1,n="w",l=0,a=0,h=[];t.getQValue=function(e,t,c,u){if(s++,r=!1,n=u?"w":"b",null!=t){stringSan=t.split("");for(let e=1;e<stringSan.length;e++)if("x"===stringSan[e]){r=!0;break}}if(!r&&c>=0&&c<=1)return 1-c;l=0,a=0,h=[];for(let t=0;t<i.length;t++)for(let s=1;s<i.length+1;s++)tile=i[t]+s,h.push(tile),piece=e.get(tile),0!=piece&&(piece.color===n?l+=o[piece.type]:a+=o[piece.type]);return(l+Number.EPSILON)/(l+a+Number.EPSILON)},t.NN=function(e,t,i,o){return Math.random()}},73:(e,t,i)=>{var o=new(i(938).Chess);t.runGame=function(e,t,i){o.reset();for(var s=0;;){if(i&&console.log(o.fen()),o.isGameOver())return o.isCheck()?t:null;var r;r=e.requiresVerbose?o.moves({verbose:!0}):o.moves();const l=e.selectMove(o,r);if(o.move(l),s++,i&&console.log(o.fen()),o.isGameOver())return o.isCheck()?e:null;var n;n=t.requiresVerbose?o.moves({verbose:!0}):o.moves();const a=t.selectMove(o,n);o.move(a),s++}console.log("game length: "+s);const l=o.moves();console.log(e.selectMove("boardPlaceholder",l))}},78:(e,t,i)=>{const{Chess:o}=i(938),s=i(627);function r(e){return e>=0&&e<=1?1-e:null}var n=-1,l=-1;class a{constructor(e){this.move=e,this.id=++l}}class h{updateNodeValue(e){this.qValue=e}constructor(e,t,i,o,r,l){this.visits=1,this.nextMoveIndex=0,this.id=++n,this.board=e,this.parent=t,this.moves=i,this.moveObjects=[],this.childrenDict=new Object,this.WorB=o,this.action=r,this.ownerColor="b",o&&(this.ownerColor="w");var a=-1;null!=this.parent&&(a=this.parent.qValue);var h=s.pieceValue(this.board,this.ownerColor,this.action,a);if(this.updateNodeValue(h),this.actionObject=null,null!=t)for(let e=0;e<t.moveObjects.length;e++)if(t.moves[e]===r){this.actionObject=t.moveObjects[e];break}}fullyExplored(){return Object.keys(this.childrenDict).length===this.moves.length}hasNoMoves(){return 0===this.moves.length}matchesAgentColor(e){return this.WorB===e}getOppColor(e){return"w"===e?"b":"b"===e?"w":(console.log("error!"),null)}bandit(e){if(Object.keys(this.childrenDict).length!=this.moves.length)return console.log("MISTAKE! node requesting next without being expanded first"),null;var t=-1,i=null,o=this.visits,s=.5;null!=e&&(s=e);for(let e=0;e<this.moveObjects.length;e++){var n=this.moveObjects[e],l=r(this.childrenDict[n.id].qValue),a=this.childrenDict[n.id].visits,h=l+s*(Math.log(o)/a);h>t&&(t=h,i=n)}return this.childrenDict[i.id]}expand(e){var t=-2,i=null;this.hasNoMoves()&&(t=this.board.isCheckmate()?0:.5);for(let e=0;e<this.moves.length;e++){var s=this.moves[e],n=new a(s);this.moveObjects.push(n);var l=new o(this.board.fen());l.move(s);var c=l.moves({verbose:!0}),u=new h(l,this,c,!this.WorB,s,!0);if(u.hasNoMoves()){if(u.board.isCheckmate()){u.qValue=0,t=1,i=n,this.childrenDict[n.id]=u;break}u.qValue=.5}r(u.qValue)>t&&(t=r(u.qValue),i=n),this.childrenDict[n.id]=u}return this.bestMoveObject=i,this.updateNodeValue(t),t}}t.getNewRoot=function(e,t,i,o,s){return new h(e,t,i,o,s,!0)},t.getLightNode=function(e,t,i,o){return new p(e,t,i,o)};let c=0,u=0,d=0,f=0,m=-1,g=null;var v=0;class p{constructor(e,t,i,o){this.id=v++,this.parent=e,this.visits=0,this.moves=[],this.WorB=t,this.action=i,this.movesDiscovered=!1,this.children={},this.board=o,this.qValue=-1,this.aValue=-1,this.banditAction=null}discoverMoves(e){this.moves=e}setQValue(e){this.qValue=e}visit(){this.visits++}bandit(){if(0===this.moves.length)return-1;m=-1,g=null,c=this.visits;for(let e=0;e<this.moves.length;e++)u=-1,this.moves[e]in this.children?(u=r(this.children[this.moves[e]].qValue),d=this.children[this.moves[e]].visits):(u=this.qValue,d=Number.EPSILON),f=u+Math.log(c)/d*.001,f>m&&(m=f,g=this.moves[e]);return g in this.children||(this.children[g]=new p(this,!this.WorB,g,null)),this.children[g]}}},938:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Chess=t.validateFen=t.SQUARES=t.DEFAULT_POSITION=t.KING=t.QUEEN=t.ROOK=t.BISHOP=t.KNIGHT=t.PAWN=t.BLACK=t.WHITE=void 0,t.WHITE="w",t.BLACK="b",t.PAWN="p",t.KNIGHT="n",t.BISHOP="b",t.ROOK="r",t.QUEEN="q",t.KING="k",t.DEFAULT_POSITION="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";const i=-1,o={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q"};t.SQUARES=["a8","b8","c8","d8","e8","f8","g8","h8","a7","b7","c7","d7","e7","f7","g7","h7","a6","b6","c6","d6","e6","f6","g6","h6","a5","b5","c5","d5","e5","f5","g5","h5","a4","b4","c4","d4","e4","f4","g4","h4","a3","b3","c3","d3","e3","f3","g3","h3","a2","b2","c2","d2","e2","f2","g2","h2","a1","b1","c1","d1","e1","f1","g1","h1"];const s={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64},r={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},n={b:[16,32,17,15],w:[-16,-32,-17,-15]},l={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},a=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],h=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],c={p:1,n:2,b:4,r:8,q:16,k:32},u=[t.KNIGHT,t.BISHOP,t.ROOK,t.QUEEN],d={w:[{square:r.a1,flag:s.QSIDE_CASTLE},{square:r.h1,flag:s.KSIDE_CASTLE}],b:[{square:r.a8,flag:s.QSIDE_CASTLE},{square:r.h8,flag:s.KSIDE_CASTLE}]},f={b:1,w:6},m=["1-0","0-1","1/2-1/2","*"];function g(e){return e>>4}function v(e){return 15&e}function p(e){return-1!=="0123456789".indexOf(e)}function _(e){const t=v(e),i=g(e);return"abcdefgh".substring(t,t+1)+"87654321".substring(i,i+1)}function b(e){return e===t.WHITE?t.BLACK:t.WHITE}function N(e){const t=[];t[0]="No errors.",t[1]="FEN string must contain six space-delimited fields.",t[2]="6th field (move number) must be a positive integer.",t[3]="5th field (half move counter) must be a non-negative integer.",t[4]="4th field (en-passant square) is invalid.",t[5]="3rd field (castling availability) is invalid.",t[6]="2nd field (side to move) is invalid.",t[7]="1st field (piece positions) does not contain 8 '/'-delimited rows.",t[8]="1st field (piece positions) is invalid [consecutive numbers].",t[9]="1st field (piece positions) is invalid [invalid piece].",t[10]="1st field (piece positions) is invalid [row too large].",t[11]="Illegal en-passant square";const i=e.split(/\s+/);if(6!==i.length)return{valid:!1,errorNumber:1,error:t[1]};const o=parseInt(i[5],10);if(isNaN(o)||o<=0)return{valid:!1,errorNumber:2,error:t[2]};const s=parseInt(i[4],10);if(isNaN(s)||s<0)return{valid:!1,errorNumber:3,error:t[3]};if(!/^(-|[abcdefgh][36])$/.test(i[3]))return{valid:!1,errorNumber:4,error:t[4]};if(!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(i[2]))return{valid:!1,errorNumber:5,error:t[5]};if(!/^(w|b)$/.test(i[1]))return{valid:!1,errorNumber:6,error:t[6]};const r=i[0].split("/");if(8!==r.length)return{valid:!1,errorNumber:7,error:t[7]};for(let e=0;e<r.length;e++){let i=0,o=!1;for(let s=0;s<r[e].length;s++)if(p(r[e][s])){if(o)return{valid:!1,errorNumber:8,error:t[8]};i+=parseInt(r[e][s],10),o=!0}else{if(!/^[prnbqkPRNBQK]$/.test(r[e][s]))return{valid:!1,errorNumber:9,error:t[9]};i+=1,o=!1}if(8!==i)return{valid:!1,errorNumber:10,error:t[10]}}return"3"==i[3][1]&&"w"==i[1]||"6"==i[3][1]&&"b"==i[1]?{valid:!1,errorNumber:11,error:t[11]}:{valid:!0,errorNumber:0,error:t[0]}}function E(e,i,o,r,n,l,a=s.NORMAL){const h=g(r);if(n!==t.PAWN||7!==h&&0!==h)e.push({color:i,from:o,to:r,piece:n,captured:l,promotion:void 0,flags:a});else for(let t=0;t<u.length;t++){const h=u[t];e.push({color:i,from:o,to:r,piece:n,captured:l,promotion:h,flags:a|s.PROMOTION})}}function S(e){let i=e.charAt(0);if(i>="a"&&i<="h"){if(e.match(/[a-h]\d.*[a-h]\d/))return;return t.PAWN}return i=i.toLowerCase(),"o"===i?t.KING:i}function C(e){return e.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}t.validateFen=N,t.Chess=class{constructor(e=t.DEFAULT_POSITION){this._board=new Array(128),this._turn=t.WHITE,this._header={},this._kings={w:i,b:i},this._epSquare=-1,this._halfMoves=0,this._moveNumber=0,this._history=[],this._comments={},this._castling={w:0,b:0},this.load(e)}clear(e=!1){this._board=new Array(128),this._kings={w:i,b:i},this._turn=t.WHITE,this._castling={w:0,b:0},this._epSquare=i,this._halfMoves=0,this._moveNumber=1,this._history=[],this._comments={},this._header=e?this._header:{},this._updateSetup(this.fen())}load(e,o=!1){const n=e.split(/\s+/),l=n[0];let a=0;if(!N(e).valid)return!1;this.clear(o);for(let e=0;e<l.length;e++){const i=l.charAt(e);if("/"===i)a+=8;else if(p(i))a+=parseInt(i,10);else{const e=i<"a"?t.WHITE:t.BLACK;this.put({type:i.toLowerCase(),color:e},_(a)),a++}}return this._turn=n[1],n[2].indexOf("K")>-1&&(this._castling.w|=s.KSIDE_CASTLE),n[2].indexOf("Q")>-1&&(this._castling.w|=s.QSIDE_CASTLE),n[2].indexOf("k")>-1&&(this._castling.b|=s.KSIDE_CASTLE),n[2].indexOf("q")>-1&&(this._castling.b|=s.QSIDE_CASTLE),this._epSquare="-"===n[3]?i:r[n[3]],this._halfMoves=parseInt(n[4],10),this._moveNumber=parseInt(n[5],10),this._updateSetup(this.fen()),!0}fen(){let e=0,o="";for(let i=r.a8;i<=r.h1;i++){if(this._board[i]){e>0&&(o+=e,e=0);const{color:s,type:r}=this._board[i];o+=s===t.WHITE?r.toUpperCase():r.toLowerCase()}else e++;i+1&136&&(e>0&&(o+=e),i!==r.h1&&(o+="/"),e=0,i+=8)}let n="";this._castling[t.WHITE]&s.KSIDE_CASTLE&&(n+="K"),this._castling[t.WHITE]&s.QSIDE_CASTLE&&(n+="Q"),this._castling[t.BLACK]&s.KSIDE_CASTLE&&(n+="k"),this._castling[t.BLACK]&s.QSIDE_CASTLE&&(n+="q"),n=n||"-";const l=this._epSquare===i?"-":_(this._epSquare);return[o,this._turn,n,l,this._halfMoves,this._moveNumber].join(" ")}_updateSetup(e){this._history.length>0||(e!==t.DEFAULT_POSITION?(this._header.SetUp="1",this._header.FEN=e):(delete this._header.SetUp,delete this._header.FEN))}reset(){this.load(t.DEFAULT_POSITION)}get(e){return this._board[r[e]]||!1}put({type:e,color:o},s){if(-1==="pnbrqkPNBRQK".indexOf(e.toLowerCase()))return!1;if(!(s in r))return!1;const n=r[s];return(e!=t.KING||this._kings[o]==i||this._kings[o]==n)&&(this._board[n]={type:e,color:o},e===t.KING&&(this._kings[o]=n),this._updateSetup(this.fen()),!0)}remove(e){const o=this.get(e);return delete this._board[r[e]],o&&o.type===t.KING&&(this._kings[o.color]=i),this._updateSetup(this.fen()),o}_attacked(e,i){for(let o=r.a8;o<=r.h1;o++){if(136&o){o+=7;continue}if(void 0===this._board[o]||this._board[o].color!==e)continue;const s=this._board[o],r=o-i,n=r+119;if(a[n]&c[s.type]){if(s.type===t.PAWN){if(r>0){if(s.color===t.WHITE)return!0}else if(s.color===t.BLACK)return!0;continue}if("n"===s.type||"k"===s.type)return!0;const e=h[n];let l=o+e,a=!1;for(;l!==i;){if(null!=this._board[l]){a=!0;break}l+=e}if(!a)return!0}}return!1}_isKingAttacked(e){return this._attacked(b(e),this._kings[e])}isCheck(){return this._isKingAttacked(this._turn)}inCheck(){return this.isCheck()}isCheckmate(){return this.isCheck()&&0===this._moves().length}isStalemate(){return!this.isCheck()&&0===this._moves().length}isInsufficientMaterial(){const e={b:0,n:0,r:0,q:0,k:0,p:0},i=[];let o=0,s=0;for(let n=r.a8;n<=r.h1;n++){if(s=(s+1)%2,136&n){n+=7;continue}const r=this._board[n];r&&(e[r.type]=r.type in e?e[r.type]+1:1,r.type===t.BISHOP&&i.push(s),o++)}if(2===o)return!0;if(3===o&&(1===e[t.BISHOP]||1===e[t.KNIGHT]))return!0;if(o===e[t.BISHOP]+2){let e=0;const t=i.length;for(let o=0;o<t;o++)e+=i[o];if(0===e||e===t)return!0}return!1}isThreefoldRepetition(){const e=[],t={};let i=!1;for(;;){const t=this._undoMove();if(!t)break;e.push(t)}for(;;){const o=this.fen().split(" ").slice(0,4).join(" ");t[o]=o in t?t[o]+1:1,t[o]>=3&&(i=!0);const s=e.pop();if(!s)break;this._makeMove(s)}return i}isDraw(){return this._halfMoves>=100||this.isStalemate()||this.isInsufficientMaterial()||this.isThreefoldRepetition()}isGameOver(){return this.isCheckmate()||this.isStalemate()||this.isDraw()}moves({verbose:e=!1,square:t}={}){const i=this._moves({square:t});return e?i.map((e=>this._makePretty(e))):i.map((e=>this._moveToSan(e,i)))}_moves({legal:e=!0,piece:i,square:o}={}){var a;const h=o?o.toLowerCase():void 0,c=null==i?void 0:i.toLowerCase(),u=[],d=this._turn,m=b(d);let v=r.a8,p=r.h1,_=!1;if(h){if(!(h in r))return[];v=p=r[h],_=!0}for(let e=v;e<=p;e++){if(136&e){e+=7;continue}if(!this._board[e]||this._board[e].color===m)continue;const{type:i}=this._board[e];let o;if(i===t.PAWN){if(c&&c!==i)continue;o=e+n[d][0],this._board[o]||(E(u,d,e,o,t.PAWN),o=e+n[d][1],f[d]!==g(e)||this._board[o]||E(u,d,e,o,t.PAWN,void 0,s.BIG_PAWN));for(let i=2;i<4;i++)o=e+n[d][i],136&o||((null===(a=this._board[o])||void 0===a?void 0:a.color)===m?E(u,d,e,o,t.PAWN,this._board[o].type,s.CAPTURE):o===this._epSquare&&E(u,d,e,o,t.PAWN,t.PAWN,s.EP_CAPTURE))}else{if(c&&c!==i)continue;for(let r=0,n=l[i].length;r<n;r++){const n=l[i][r];for(o=e;o+=n,!(136&o);){if(this._board[o]){if(this._board[o].color===d)break;E(u,d,e,o,i,this._board[o].type,s.CAPTURE);break}if(E(u,d,e,o,i),i===t.KNIGHT||i===t.KING)break}}}}if(!(void 0!==c&&c!==t.KING||_&&p!==this._kings[d])){if(this._castling[d]&s.KSIDE_CASTLE){const e=this._kings[d],i=e+2;this._board[e+1]||this._board[i]||this._attacked(m,this._kings[d])||this._attacked(m,e+1)||this._attacked(m,i)||E(u,d,this._kings[d],i,t.KING,void 0,s.KSIDE_CASTLE)}if(this._castling[d]&s.QSIDE_CASTLE){const e=this._kings[d],i=e-2;this._board[e-1]||this._board[e-2]||this._board[e-3]||this._attacked(m,this._kings[d])||this._attacked(m,e-1)||this._attacked(m,i)||E(u,d,this._kings[d],i,t.KING,void 0,s.QSIDE_CASTLE)}}if(!e)return u;const N=[];for(let e=0,t=u.length;e<t;e++)this._makeMove(u[e]),this._isKingAttacked(d)||N.push(u[e]),this._undoMove();return N}move(e,{sloppy:t=!1}={}){let i=null;if("string"==typeof e)i=this._moveFromSan(e,t);else if("object"==typeof e){const t=this._moves();for(let o=0,s=t.length;o<s;o++)if(e.from===_(t[o].from)&&e.to===_(t[o].to)&&(!("promotion"in t[o])||e.promotion===t[o].promotion)){i=t[o];break}}if(!i)return null;const o=this._makePretty(i);return this._makeMove(i),o}_push(e){this._history.push({move:e,kings:{b:this._kings.b,w:this._kings.w},turn:this._turn,castling:{b:this._castling.b,w:this._castling.w},epSquare:this._epSquare,halfMoves:this._halfMoves,moveNumber:this._moveNumber})}_makeMove(e){const o=this._turn,r=b(o);if(this._push(e),this._board[e.to]=this._board[e.from],delete this._board[e.from],e.flags&s.EP_CAPTURE&&(this._turn===t.BLACK?delete this._board[e.to-16]:delete this._board[e.to+16]),e.promotion&&(this._board[e.to]={type:e.promotion,color:o}),this._board[e.to].type===t.KING){if(this._kings[o]=e.to,e.flags&s.KSIDE_CASTLE){const t=e.to-1,i=e.to+1;this._board[t]=this._board[i],delete this._board[i]}else if(e.flags&s.QSIDE_CASTLE){const t=e.to+1,i=e.to-2;this._board[t]=this._board[i],delete this._board[i]}this._castling[o]=0}if(this._castling[o])for(let t=0,i=d[o].length;t<i;t++)if(e.from===d[o][t].square&&this._castling[o]&d[o][t].flag){this._castling[o]^=d[o][t].flag;break}if(this._castling[r])for(let t=0,i=d[r].length;t<i;t++)if(e.to===d[r][t].square&&this._castling[r]&d[r][t].flag){this._castling[r]^=d[r][t].flag;break}e.flags&s.BIG_PAWN?o===t.BLACK?this._epSquare=e.to-16:this._epSquare=e.to+16:this._epSquare=i,e.piece===t.PAWN||e.flags&(s.CAPTURE|s.EP_CAPTURE)?this._halfMoves=0:this._halfMoves++,o===t.BLACK&&this._moveNumber++,this._turn=r}undo(){const e=this._undoMove();return e?this._makePretty(e):null}_undoMove(){const e=this._history.pop();if(void 0===e)return null;const i=e.move;this._kings=e.kings,this._turn=e.turn,this._castling=e.castling,this._epSquare=e.epSquare,this._halfMoves=e.halfMoves,this._moveNumber=e.moveNumber;const o=this._turn,r=b(o);if(this._board[i.from]=this._board[i.to],this._board[i.from].type=i.piece,delete this._board[i.to],i.captured)if(i.flags&s.EP_CAPTURE){let e;e=o===t.BLACK?i.to-16:i.to+16,this._board[e]={type:t.PAWN,color:r}}else this._board[i.to]={type:i.captured,color:r};if(i.flags&(s.KSIDE_CASTLE|s.QSIDE_CASTLE)){let e,t;i.flags&s.KSIDE_CASTLE?(e=i.to+1,t=i.to-1):(e=i.to-2,t=i.to+1),this._board[e]=this._board[t],delete this._board[t]}return i}pgn({newline:e="\n",maxWidth:t=0}={}){const i=[];let o=!1;for(const t in this._header)i.push("["+t+' "'+this._header[t]+'"]'+e),o=!0;o&&this._history.length&&i.push(e);const s=e=>{const t=this._comments[this.fen()];return void 0!==t&&(e=`${e}${e.length>0?" ":""}{${t}}`),e},r=[];for(;this._history.length>0;)r.push(this._undoMove());const n=[];let l="";for(0===r.length&&n.push(s(""));r.length>0;){l=s(l);const e=r.pop();if(!e)break;if(this._history.length||"b"!==e.color)"w"===e.color&&(l.length&&n.push(l),l=this._moveNumber+".");else{const e=`${this._moveNumber}. ...`;l=l?`${l} ${e}`:e}l=l+" "+this._moveToSan(e,this._moves({legal:!0})),this._makeMove(e)}if(l.length&&n.push(s(l)),void 0!==this._header.Result&&n.push(this._header.Result),0===t)return i.join("")+n.join(" ");const a=function(){return i.length>0&&" "===i[i.length-1]&&(i.pop(),!0)},h=function(o,s){for(const r of s.split(" "))if(r){if(o+r.length>t){for(;a();)o--;i.push(e),o=0}i.push(r),o+=r.length,i.push(" "),o++}return a()&&o--,o};let c=0;for(let o=0;o<n.length;o++)c+n[o].length>t&&n[o].includes("{")?c=h(c,n[o]):(c+n[o].length>t&&0!==o?(" "===i[i.length-1]&&i.pop(),i.push(e),c=0):0!==o&&(i.push(" "),c++),i.push(n[o]),c+=n[o].length);return i.join("")}header(...e){for(let t=0;t<e.length;t+=2)"string"==typeof e[t]&&"string"==typeof e[t+1]&&(this._header[e[t]]=e[t+1]);return this._header}loadPgn(e,{sloppy:t=!1,newlineChar:i="\r?\n"}={}){function o(e){return e.replace(/\\/g,"\\")}e=e.trim();const s=new RegExp("^(\\[((?:"+o(i)+")|.)*\\])(?:\\s*"+o(i)+"){2}").exec(e),r=s&&s.length>=2?s[1]:"";this.reset();const n=function(e){const t={},s=e.split(new RegExp(o(i)));let r="",n="";for(let e=0;e<s.length;e++){const i=/^\s*\[([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;r=s[e].replace(i,"$1"),n=s[e].replace(i,"$2"),r.trim().length>0&&(t[r]=n)}return t}(r);let l="";for(const e in n)"fen"===e.toLowerCase()&&(l=n[e]),this.header(e,n[e]);if(t){if(l&&!this.load(l,!0))return!1}else if(!("1"!==n.SetUp||"FEN"in n&&this.load(n.FEN,!0)))return!1;const a=function(e){return`{${function(e){return Array.from(e).map((function(e){return e.charCodeAt(0)<128?e.charCodeAt(0).toString(16):encodeURIComponent(e).replace(/%/g,"").toLowerCase()})).join("")}((e=e.replace(new RegExp(o(i),"g")," ")).slice(1,e.length-1))}}`},h=function(e){if(e.startsWith("{")&&e.endsWith("}"))return function(e){return 0==e.length?"":decodeURIComponent("%"+(e.match(/.{1,2}/g)||[]).join("%"))}(e.slice(1,e.length-1))};let c=e.replace(r,"").replace(new RegExp(`({[^}]*})+?|;([^${o(i)}]*)`,"g"),(function(e,t,i){return void 0!==t?a(t):" "+a(`{${i.slice(1)}}`)})).replace(new RegExp(o(i),"g")," ");const u=/(\([^()]+\))+?/g;for(;u.test(c);)c=c.replace(u,"");c=c.replace(/\d+\.(\.\.)?/g,""),c=c.replace(/\.\.\./g,""),c=c.replace(/\$\d+/g,"");let d=c.trim().split(new RegExp(/\s+/));d=d.join(",").replace(/,,+/g,",").split(",");let f="";for(let e=0;e<d.length;e++){const i=h(d[e]);if(void 0!==i){this._comments[this.fen()]=i;continue}const o=this._moveFromSan(d[e],t);if(null==o){if(!(m.indexOf(d[e])>-1))return!1;f=d[e]}else f="",this._makeMove(o)}return f&&Object.keys(this._header).length&&!this._header.Result&&this.header("Result",f),!0}_moveToSan(e,i){let o="";if(e.flags&s.KSIDE_CASTLE)o="O-O";else if(e.flags&s.QSIDE_CASTLE)o="O-O-O";else{if(e.piece!==t.PAWN){const t=function(e,t){const i=e.from,o=e.to,s=e.piece;let r=0,n=0,l=0;for(let e=0,a=t.length;e<a;e++){const a=t[e].from,h=t[e].to;s===t[e].piece&&i!==a&&o===h&&(r++,g(i)===g(a)&&n++,v(i)===v(a)&&l++)}return r>0?n>0&&l>0?_(i):l>0?_(i).charAt(1):_(i).charAt(0):""}(e,i);o+=e.piece.toUpperCase()+t}e.flags&(s.CAPTURE|s.EP_CAPTURE)&&(e.piece===t.PAWN&&(o+=_(e.from)[0]),o+="x"),o+=_(e.to),e.promotion&&(o+="="+e.promotion.toUpperCase())}return this._makeMove(e),this.isCheck()&&(this.isCheckmate()?o+="#":o+="+"),this._undoMove(),o}_moveFromSan(e,t=!1){const i=C(e);let o,s,n,l,a,h=S(i),c=this._moves({legal:!0,piece:h});for(let e=0,t=c.length;e<t;e++)if(i===C(this._moveToSan(c[e],c)))return c[e];if(!t)return null;let u=!1;s=i.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/),s?(o=s[1],n=s[2],l=s[3],a=s[4],1==n.length&&(u=!0)):(s=i.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/),s&&(o=s[1],n=s[2],l=s[3],a=s[4],1==n.length&&(u=!0))),h=S(i),c=this._moves({legal:!0,piece:o||h});for(let e=0,t=c.length;e<t;e++)if(n&&l){if(!(o&&o.toLowerCase()!=c[e].piece||r[n]!=c[e].from||r[l]!=c[e].to||a&&a.toLowerCase()!=c[e].promotion))return c[e];if(u){const t=_(c[e].from);if(!(o&&o.toLowerCase()!=c[e].piece||r[l]!=c[e].to||n!=t[0]&&n!=t[1]||a&&a.toLowerCase()!=c[e].promotion))return c[e]}}return null}ascii(){let e="   +------------------------+\n";for(let i=r.a8;i<=r.h1;i++){if(0===v(i)&&(e+=" "+"87654321"[g(i)]+" |"),this._board[i]){const o=this._board[i].type;e+=" "+(this._board[i].color===t.WHITE?o.toUpperCase():o.toLowerCase())+" "}else e+=" . ";i+1&136&&(e+="|\n",i+=8)}return e+="   +------------------------+\n",e+="     a  b  c  d  e  f  g  h",e}perft(e){const t=this._moves({legal:!1});let i=0;const o=this._turn;for(let s=0,r=t.length;s<r;s++)this._makeMove(t[s]),this._isKingAttacked(o)||(e-1>0?i+=this.perft(e-1):i++),this._undoMove();return i}_makePretty(e){const{color:t,piece:i,from:r,to:n,flags:l,captured:a,promotion:h}=e;let c="";for(const e in s)s[e]&l&&(c+=o[e]);const u={color:t,piece:i,from:_(r),to:_(n),san:this._moveToSan(e,this._moves({legal:!0})),flags:c};return a&&(u.captured=a),h&&(u.promotion=h),u}turn(){return this._turn}board(){const e=[];let t=[];for(let i=r.a8;i<=r.h1;i++)null==this._board[i]?t.push(null):t.push({square:_(i),type:this._board[i].type,color:this._board[i].color}),i+1&136&&(e.push(t),t=[],i+=8);return e}squareColor(e){if(e in r){const t=r[e];return(g(t)+v(t))%2==0?"light":"dark"}return null}history({verbose:e=!1}={}){const t=[],i=[];for(;this._history.length>0;)t.push(this._undoMove());for(;;){const o=t.pop();if(!o)break;e?i.push(this._makePretty(o)):i.push(this._moveToSan(o,this._moves())),this._makeMove(o)}return i}_pruneComments(){const e=[],t={},i=e=>{e in this._comments&&(t[e]=this._comments[e])};for(;this._history.length>0;)e.push(this._undoMove());for(i(this.fen());;){const t=e.pop();if(!t)break;this._makeMove(t),i(this.fen())}this._comments=t}getComment(){return this._comments[this.fen()]}setComment(e){this._comments[this.fen()]=e.replace("{","[").replace("}","]")}deleteComment(){const e=this._comments[this.fen()];return delete this._comments[this.fen()],e}getComments(){return this._pruneComments(),Object.keys(this._comments).map((e=>({fen:e,comment:this._comments[e]})))}deleteComments(){return this._pruneComments(),Object.keys(this._comments).map((e=>{const t=this._comments[e];return delete this._comments[e],{fen:e,comment:t}}))}}}},t={};function i(o){var s=t[o];if(void 0!==s)return s.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,i),r.exports}(()=>{var e=i(176),t=!0,o=e.getAgent("random",0,!0),s=null,r=!1,n=!1,l=!0;const a=i(938);var h=new a.Chess,c=0;function u(){return++c}function d(t){o=e.getAgent(t,u,!p)}var f=!0;function m(e,t,i,o){return f=!1,!h.isGameOver()&&!!l&&(!p||-1===t.search(/^b/))&&!(!p&&-1!==t.search(/^w/))&&void 0}function g(e,t){var i=!1,o=null;if(firstLetter=t.split("")[1],firstLetter!==8..toString()&&"1"!==firstLetter||(piece=h.get(e),"p"===piece.type&&(i=!0,o=h.move({from:e,to:t,promotion:"q"}))),i||(o=h.move({from:e,to:t})),null===o)return f=!0,"snapback";f=!1,K=!0,h.isGameOver()?console.log("Game over"):window.setTimeout(v,15),n=!1,l=!1,window.setTimeout(B,15)}function v(){r=!0}s=Chessboard("myBoard",{draggable:!0,position:"start",onDragStart:m,onDrop:g});var p=!0,_=document.getElementById("CompVComp"),b=document.getElementById("colorButton"),N=document.getElementById("resetButton"),E=document.getElementById("allowBuilding");_.addEventListener("click",(function(){!function(){const t=e.getAgent("MCTS",1,!0),o=e.getAgent("random",2,!1);agent1Wins=0,agent2Wins=0,draws=0;for(let e=0;e<5;e++){const e=i(73).runGame(t,o,!0);null!=e?(result="Player "+e.id+" Wins",1===e.id?agent1Wins+=1:agent2Wins+=1):(result="Draw",draws+=1),console.log(result)}const s=agent1Wins+agent2Wins+draws,r=Math.pow(10,2);console.log("\nGames Played  :  "+s),console.log("Agent "+t.id+"       :  "+agent1Wins+" ("+Math.round((100*agent1Wins/s+Number.EPSILON)*r)/r+" %)"),console.log("Agent "+o.id+"       :  "+agent2Wins+" ("+Math.round((100*agent2Wins/s+Number.EPSILON)*r)/r+" %)"),console.log("Draws         :  "+draws+" ("+Math.round((100*draws/s+Number.EPSILON)*r)/r+" %)"),console.log("")}()}),!1),b.addEventListener("click",(function(){!function(){if(!K){o.WorB=p;var e="White";if(p=!p)t={draggable:!0,position:"start",onDragStart:m,onDrop:g},s=Chessboard("myBoard",t),l=!1;else{var t={draggable:!0,position:"start",orientation:"black",onDragStart:m,onDrop:g};s=Chessboard("myBoard",t),e="Black",K=!0,window.setTimeout(D(),250),l=!0}document.getElementById("playerColor").innerHTML="Playing as: "+e}}()}),!1),N.addEventListener("click",(function(){console.log("resetting"),h=new a.Chess,s.position(h.fen()),l=!0,K=!1}),!1),E.addEventListener("click",(function(){t=!t,console.log("Tree building enabled: "+t)}),!1);var S=document.getElementById("randomAgent"),C=document.getElementById("heuristicAgent"),T=document.getElementById("MCTSAgent"),k=document.getElementById("LightAgent"),I=document.getElementById("NNGreedy");S.addEventListener("click",(function(){P("random")}),!1),C.addEventListener("click",(function(){P("heuristic")}),!1),T.addEventListener("click",(function(){P("MCTS")}),!1),k.addEventListener("click",(function(){P("LightMCTSAgent")}),!1),I.addEventListener("click",(function(){P("NNGreedy")}),!1),P("LightMCTSAgent");var A=document.getElementById("changeTo05"),y=document.getElementById("changeTo1"),L=document.getElementById("changeTo2"),w=document.getElementById("changeTo3"),M=document.getElementById("changeTo5");function O(e){console.log("Setting time limit to "+e+" seconds."),null!=o&&o.hasTimeLimit&&o.setTimeLimit(e)}function P(e){if(!K){var t=!0;"random"===e?d("random"):"heuristic"===e?d("alwaysTake"):"MCTS"===e?d("MCTS"):"LightMCTSAgent"===e?d("LightMCTS"):"NNGreedy"===e?d("NNGreedy"):t=!1,t&&console.log("Changing agent to '"+e+"'")}}function B(){s.position(h.fen()),n=!0}function q(){f=!0}function D(){moves=null,o.requiresVerbose?moves=h.moves({verbose:!0}):moves=h.moves(),nextMove=o.selectMove(h,moves),h.move(nextMove),h.isGameOver()&&console.log("Game over"),window.setTimeout(B,0),l=!0,window.setTimeout(q,50)}A.addEventListener("click",(function(){O(.5)}),!1),y.addEventListener("click",(function(){O(1)}),!1),L.addEventListener("click",(function(){O(2)}),!1),w.addEventListener("click",(function(){O(3)}),!1),M.addEventListener("click",(function(){O(5)}),!1),startDate=Date.now(),window.onload=function(){setInterval((function(){r?W<10?W++:n&&(D(),r=!1,W=0):K&&o.offlineTreeBuilding&&f&&t&&o.offlineImproveTree()}),0)};var W=0,K=!1})()})();