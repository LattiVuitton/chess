(()=>{var e={176:(e,t,o)=>{const{Chess:i}=o(938),s=o(627),r=o(78);function n(e){return e>=0&&e<=1?1-e:null}class h{constructor(e,t){this.id=e,this.WorB=t,this.requiresVerbose=!0,this.requiresLastPlayerMove=!1,this.offlineTreeBuilding=!0,this.hasTimeLimit=!1}selectMove(e,t){return null}}class l extends h{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.boardsGenerated=0}selectMove(e,t){var o="b";this.WorB&&(o="w");var r=null,n=-1;for(let l=0;l<t.length;l++){var h=new i(e.fen());this.boardsGenerated+=1;const a=t[l];h.move(a);const u=s.NN(h,o,null,0);u>n&&(r=a,n=u)}return r}}var a={random:class extends h{constructor(e,t){super(e,t),this.requiresVerbose=!1}selectMove(e,t){return t[Math.floor(Math.random()*t.length)]}},alwaysTake:class extends h{constructor(e,t){super(e,t),this.requiresVerbose=!0}selectMove(e,t){for(let s=0;s<t.length;s++){const r=t[s];if((o=new i(e.fen())).move(r),o.isCheckmate())return r}for(let o=0;o<t.length;o++){const i=t[o];if(0!=e.get(i.to))return i}for(let s=0;s<t.length;s++){const r=t[s];var o;if((o=new i(e.fen())).move(r),o.isCheck())return r}return t[Math.floor(Math.random()*t.length)]}},greedy:l,MCTS:class extends h{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.rootNode=null,this.rootID=-1,this.allExpandedNodes=[],this.requiresLastPlayerMove=!0,this.offlineTreeBuilding=!0,this.timeLimit=1,this.hasTimeLimit=!0,this.MIN_ROUNDS=10,this.playerAvailableMoves=null,this.playerBoardState=null,this.MAX_PATH_LENGTH=1e3,this.turn=t?1:2}setTimeLimit(e){this.timeLimit=e}nodeVisited(e){for(let t=0;t<this.allExpandedNodes.length;t++)if(e===this.allExpandedNodes[t])return!0;return!1}offlineImproveTree(){this.improveTree(!0)}improveTree(e){var t=this.rootNode;e&&(t.fullyExplored()||t.expand(),t=this.rootNode.bandit(.3));var o=[t],i=t;i.visits++;for(var s=!0;i.fullyExplored();){if(i.hasNoMoves()){s=!1;break}if(o.length>this.MAX_PATH_LENGTH){s=!1;break}(i=i.bandit()).visits++,o.push(i)}var r=0;s&&(r=i.expand(this.WorB));var h=0,l=0;i.matchesAgentColor(this.WorB)?(l=n(r),h=r):(h=n(r),l=r);for(let e=o.length-2;e>=0;e--){var a=o[e];if(s||e!==o.length){var u=l;if(a.matchesAgentColor(this.WorB)&&(u=h),!(u>a.qValue))break;a.bestMoveObject=o[e+1].actionObject,a.updateNodeValue(u)}else console.log("No backprop here")}}selectMove(e,t){this.allExpandedNodes=[];var o=!1;if(null!=this.playerAvailableMoves)for(let t=0;t<this.playerAvailableMoves.length;t++){var s=this.playerAvailableMoves[t],h=new i(this.playerBoardState.board.fen());h.move(s.move),h.fen()===e.fen()&&null!=this.playerBoardState&&(this.rootNode=this.playerBoardState.childrenDict[s.id],o=!0)}null!==this.rootNode&&o?console.log("Found!"):(this.rootNode=r.getNewRoot(e,null,e.moves({verbose:!0}),this.WorB,null),console.log("Couldnt retrieve, giving new: "+this.rootNode.id)),this.turn++;var l=1e3*this.timeLimit;const a=Date.now();for(var u=0;Date.now()-a<l||u<this.MIN_ROUNDS;)u++,this.improveTree(!1);var c,d=null,f=-1,m=null,v=Object.keys(this.rootNode.moveObjects).length;for(let e=0;e<v;e++){var p=this.rootNode.moveObjects[e],g=this.rootNode.childrenDict[p.id];console.log("\nMove: "+p.move.to),console.log("Value: "+(c=n(g.qValue),4,Number(Math.round(c+"e4")+"e-4"))),console.log("Visits: "+g.visits),n(g.qValue)>f&&(d=p.move,f=n(g.qValue),m=g)}m.fullyExplored(),this.playerAvailableMoves=[];for(let e=0;e<m.moveObjects.length;e++)this.playerAvailableMoves.push(m.moveObjects[e]);return this.playerBoardState=m,this.rootNode=m,d}},LightMCTS:class extends h{constructor(e,t){super(e,t),this.requiresVerbose=!0,this.rootNode=null,this.offlineTreeBuilding=!0,this.timeLimit=.8,this.hasTimeLimit=!0,this.MIN_ROUNDS=100,this.testGame,this.playerMoves=null,this.previousBoard=null,this.OFFLINE_BATCH_SIZE=20}setTimeLimit(e){this.timeLimit=e}invertQvalue(e){return 1-e}offlineImproveTree(){console.log("werc");for(let e=0;e<this.OFFLINE_BATCH_SIZE;e++)this.improveTree()}improveTree(){void 0===this.nodesGenerated?this.nodesGenerated=0:this.nodesGenerated++;let e=this.rootNode,t=[e];for(;e.visits>0;){let o=e.bandit();if(-1===o){e.visit();break}e=o,t.push(e),this.testGame.move(e.action)}let o=-1;if(null!=e.parent&&(o=e.parent.qValue),e.movesDiscoverd)return;e.discoverMoves(this.testGame.moves()),e.movesDiscoverd=!0,0===e.moves.length?this.testGame.isCheckmate()?e.setQValue(0):e.setQValue(.5):e.setQValue(s.complexEval(this.testGame,e.WorB,e.moves.length,o));let i=!1;for(let e=t.length-1;e>=0;e--)if(this.testGame.undo(t[e].action),t[e].visit(),e<t.length-1)if(this.invertQvalue(t[e+1].qValue)>t[e].qValue)t[e].setQValue(this.invertQvalue(t[e+1].qValue)),i=!0;else{if(!i){for(let o=e-1;o>=0;o--)this.testGame.undo(t[o].action),t[o].visit();break}{let o=-1;for(let i in t[e].children)this.invertQvalue(t[e].children[i].qValue)>o&&(o=this.invertQvalue(t[e].children[i].qValue));t[e].setQValue(o)}}}selectMove(e,t,o){if(1===o&&this.WorB)return"e4";s.updateGamePeriod(e);const n=Date.now();var h=0;let l=!0;if(null!=this.playerMoves||null!=this.previousBoard){let t=new i(this.previousBoard.fen());for(let o=0;o<this.playerMoves.length;o++)t.move(this.playerMoves[o]),t.fen()===e.fen()&&(this.rootNode=this.rootNode.children[this.playerMoves[o]],null!=this.rootNode&&(this.rootNode.board=e,l=!1)),t.undo(this.playerMoves[o])}for(l&&(this.rootNode=r.getLightNode(null,this.WorB,null,e)),this.testGame=new i(this.rootNode.board.fen()),this.nodesGenerated=0;Date.now()-n<1e3*this.timeLimit||h<this.MIN_ROUNDS;)h++,this.improveTree();let a=-1,u=null,c=0,d=0;for(var f in this.rootNode.children)d+=this.rootNode.children[f].visits,c="O-O"!=f&&"O-O-O"!=f||!s.getEarly?0:.05,this.invertQvalue(this.rootNode.children[f].qValue)+c>a&&(u=f,a=this.invertQvalue(this.rootNode.children[f].qValue));return console.log("Evaluated "+d+" board positions."),this.playerMoves=this.rootNode.children[u].moves,this.previousBoard=new i(this.rootNode.board.fen()),this.previousBoard.move(u),this.testGame=new i(this.previousBoard.fen()),this.rootNode=this.rootNode.children[u],this.rootNode.board=new i(this.previousBoard.fen()),u}},NNGreedy:l};t.getAgent=function(e,t,o){const i=Object.keys(a);for(let s=0;s<i.length;s++)if(i[s]===e)return new a[e](t,o);return null}},627:(e,t)=>{let o={w:[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]],b:[[20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],[-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30]]},i={w:[[-50,-40,-30,-20,-20,-30,-40,-50],[-30,-20,-10,0,0,-10,-20,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-30,0,0,0,0,-30,-30],[-50,-30,-30,-30,-30,-30,-30,-50]],b:[[-50,-30,-30,-30,-30,-30,-30,-50],[-50,-30,-30,-30,-30,-30,-30,-50],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-20,-10,0,0,-10,-20,-30],[-50,-40,-30,-20,-20,-30,-40,-50]]},s={w:{p:[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],n:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],b:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],r:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]]},b:{p:[[0,0,0,0,0,0,0,0],[5,10,10,-20,-20,10,10,5],[5,-5,-10,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0]],n:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],b:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],r:[[0,0,0,5,5,0,0,0],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[5,10,10,10,10,10,10,5],[0,0,0,0,0,0,0,0]],q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,5,0,0,0,0,-10],[-10,5,5,5,5,5,0,-10],[0,0,5,5,5,5,0,-5],[-5,0,5,5,5,5,0,-5],[-10,0,5,5,5,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]]}},r={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7};function n(e){return 8-e}function h(e,t,h,l,a){if("k"===h)return a?i[l][n(t)][r[e]]:o[l][n(t)][r[e]];try{return s[l][h][n(t)][r[e]]}catch{return console.log("Error finding tile"),null}}const l=33.5+8*Math.max(1,1.5),a=-1*l,u=["a","b","c","d","e","f","g","h"],c={p:1,n:3.05,b:3.33,r:5.63,q:9.5,k:100};var d=!0;let f=0,m=0,v=null,p=0,g=!1,_=!1,b=1,N=0,E=0,C=0;t.getEarly=function(){return d},t.updateGamePeriod=function(e){let t=0;for(let o=0;o<u.length;o++)for(let i=1;i<u.length+1;i++)piece=e.get(u[o]+i),piece&&(t+=c[piece.type]);var o;d=o=t>40,o?(N=.9,E=.1,C=0):(N=.85,E=.15,C=0)},t.complexEval=function(e,t){myTeamColor=t?"w":"b",p=0,m=0,f=0;for(let t=0;t<u.length;t++){g=!1,_=!1;for(let o=1;o<u.length+1;o++)v=e.get(u[t]+o),v&&(b=v.color===myTeamColor?1:-1,m+=b*h(u[t],o,v.type,v.color,!d),f+=b*c[v.type],"p"===v.type&&(t<u.length-1&&o<8&&o>1&&("p"===e.get(u[t+1]+o).type&&e.get(u[t+1]+o).color===v.color&&(p+=1*b),"p"===e.get(u[t+1]+(o+1)).type&&e.get(u[t+1]+(o+1)).color===v.color&&(p+=1.5*b),"p"===e.get(u[t+1]+(o-1)).type&&e.get(u[t+1]+(o-1)).color===v.color&&(p+=1.5*b)),v.color===myTeamColor?g?p-=2.5:g=!0:_?p+=2.5:_=!0));g?_||(p+=2):_||(p-=2)}return E*((m- -905)/1810)+N*((f- -41.52)/83.04)+C*((p-a)/(l-a))}},73:(e,t,o)=>{var i=new(o(938).Chess);t.runGame=function(e,t,o){i.reset();for(var s=0;;){if(o&&console.log(i.fen()),i.isGameOver())return i.isCheck()?t:null;var r;r=e.requiresVerbose?i.moves({verbose:!0}):i.moves();const h=e.selectMove(i,r);if(i.move(h),s++,o&&console.log(i.fen()),i.isGameOver())return i.isCheck()?e:null;var n;n=t.requiresVerbose?i.moves({verbose:!0}):i.moves();const l=t.selectMove(i,n);i.move(l),s++}console.log("game length: "+s);const h=i.moves();console.log(e.selectMove("boardPlaceholder",h))}},78:(e,t,o)=>{const{Chess:i}=o(938),s=o(627);function r(e){return e>=0&&e<=1?1-e:null}var n=-1,h=-1;class l{constructor(e){this.move=e,this.id=++h}}class a{updateNodeValue(e){this.qValue=e}constructor(e,t,o,i,r,h){this.visits=1,this.nextMoveIndex=0,this.id=++n,this.board=e,this.parent=t,this.moves=o,this.moveObjects=[],this.childrenDict=new Object,this.WorB=i,this.action=r,this.ownerColor="b",i&&(this.ownerColor="w");var l=-1;null!=this.parent&&(l=this.parent.qValue);var a=s.getQValue(this.board,this.action,l,this.ownerColor);if(this.updateNodeValue(a),this.actionObject=null,null!=t)for(let e=0;e<t.moveObjects.length;e++)if(t.moves[e]===r){this.actionObject=t.moveObjects[e];break}}fullyExplored(){return Object.keys(this.childrenDict).length===this.moves.length}hasNoMoves(){return 0===this.moves.length}matchesAgentColor(e){return this.WorB===e}getOppColor(e){return"w"===e?"b":"b"===e?"w":(console.log("error!"),null)}bandit(e){if(Object.keys(this.childrenDict).length!=this.moves.length)return console.log("MISTAKE! node requesting next without being expanded first"),null;var t=-1,o=null,i=this.visits,s=.5;null!=e&&(s=e);for(let e=0;e<this.moveObjects.length;e++){var n=this.moveObjects[e],h=r(this.childrenDict[n.id].qValue),l=this.childrenDict[n.id].visits,a=h+s*(Math.log(i)/l);a>t&&(t=a,o=n)}return this.childrenDict[o.id]}expand(e){var t=-2,o=null;this.hasNoMoves()&&(t=this.board.isCheckmate()?0:.5);for(let e=0;e<this.moves.length;e++){var s=this.moves[e],n=new l(s);this.moveObjects.push(n);var h=new i(this.board.fen());h.move(s);var u=h.moves({verbose:!0}),c=new a(h,this,u,!this.WorB,s,!0);if(c.hasNoMoves()){if(c.board.isCheckmate()){c.qValue=0,t=1,o=n,this.childrenDict[n.id]=c;break}c.qValue=.5}r(c.qValue)>t&&(t=r(c.qValue),o=n),this.childrenDict[n.id]=c}return this.bestMoveObject=o,this.updateNodeValue(t),t}}t.getNewRoot=function(e,t,o,i,s){return new a(e,t,o,i,s,!0)},t.getLightNode=function(e,t,o,i){return new g(e,t,o,i)};let u=0,c=0,d=0,f=0,m=-1,v=null;var p=0;class g{constructor(e,t,o,i){this.id=p++,this.parent=e,this.visits=0,this.moves=[],this.WorB=t,this.action=o,this.movesDiscovered=!1,this.children={},this.board=i,this.qValue=-1,this.aValue=-1,this.banditAction=null}discoverMoves(e){this.moves=e}setQValue(e){this.qValue=e}visit(){this.visits++}bandit(){if(0===this.moves.length)return-1;m=-1,v=null,u=this.visits;for(let e=0;e<this.moves.length;e++)c=-1,this.moves[e]in this.children?(c=r(this.children[this.moves[e]].qValue),d=this.children[this.moves[e]].visits):(c=this.qValue,d=Number.EPSILON),f=c+Math.log(u)/d*.1,f>m&&(m=f,v=this.moves[e]);return v in this.children||(this.children[v]=new g(this,!this.WorB,v,null)),this.children[v]}}},938:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Chess=t.validateFen=t.SQUARES=t.DEFAULT_POSITION=t.KING=t.QUEEN=t.ROOK=t.BISHOP=t.KNIGHT=t.PAWN=t.BLACK=t.WHITE=void 0,t.WHITE="w",t.BLACK="b",t.PAWN="p",t.KNIGHT="n",t.BISHOP="b",t.ROOK="r",t.QUEEN="q",t.KING="k",t.DEFAULT_POSITION="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";const o=-1,i={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q"};t.SQUARES=["a8","b8","c8","d8","e8","f8","g8","h8","a7","b7","c7","d7","e7","f7","g7","h7","a6","b6","c6","d6","e6","f6","g6","h6","a5","b5","c5","d5","e5","f5","g5","h5","a4","b4","c4","d4","e4","f4","g4","h4","a3","b3","c3","d3","e3","f3","g3","h3","a2","b2","c2","d2","e2","f2","g2","h2","a1","b1","c1","d1","e1","f1","g1","h1"];const s={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64},r={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},n={b:[16,32,17,15],w:[-16,-32,-17,-15]},h={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},l=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],a=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],u={p:1,n:2,b:4,r:8,q:16,k:32},c=[t.KNIGHT,t.BISHOP,t.ROOK,t.QUEEN],d={w:[{square:r.a1,flag:s.QSIDE_CASTLE},{square:r.h1,flag:s.KSIDE_CASTLE}],b:[{square:r.a8,flag:s.QSIDE_CASTLE},{square:r.h8,flag:s.KSIDE_CASTLE}]},f={b:1,w:6},m=["1-0","0-1","1/2-1/2","*"];function v(e){return e>>4}function p(e){return 15&e}function g(e){return-1!=="0123456789".indexOf(e)}function _(e){const t=p(e),o=v(e);return"abcdefgh".substring(t,t+1)+"87654321".substring(o,o+1)}function b(e){return e===t.WHITE?t.BLACK:t.WHITE}function N(e){const t=[];t[0]="No errors.",t[1]="FEN string must contain six space-delimited fields.",t[2]="6th field (move number) must be a positive integer.",t[3]="5th field (half move counter) must be a non-negative integer.",t[4]="4th field (en-passant square) is invalid.",t[5]="3rd field (castling availability) is invalid.",t[6]="2nd field (side to move) is invalid.",t[7]="1st field (piece positions) does not contain 8 '/'-delimited rows.",t[8]="1st field (piece positions) is invalid [consecutive numbers].",t[9]="1st field (piece positions) is invalid [invalid piece].",t[10]="1st field (piece positions) is invalid [row too large].",t[11]="Illegal en-passant square";const o=e.split(/\s+/);if(6!==o.length)return{valid:!1,errorNumber:1,error:t[1]};const i=parseInt(o[5],10);if(isNaN(i)||i<=0)return{valid:!1,errorNumber:2,error:t[2]};const s=parseInt(o[4],10);if(isNaN(s)||s<0)return{valid:!1,errorNumber:3,error:t[3]};if(!/^(-|[abcdefgh][36])$/.test(o[3]))return{valid:!1,errorNumber:4,error:t[4]};if(!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(o[2]))return{valid:!1,errorNumber:5,error:t[5]};if(!/^(w|b)$/.test(o[1]))return{valid:!1,errorNumber:6,error:t[6]};const r=o[0].split("/");if(8!==r.length)return{valid:!1,errorNumber:7,error:t[7]};for(let e=0;e<r.length;e++){let o=0,i=!1;for(let s=0;s<r[e].length;s++)if(g(r[e][s])){if(i)return{valid:!1,errorNumber:8,error:t[8]};o+=parseInt(r[e][s],10),i=!0}else{if(!/^[prnbqkPRNBQK]$/.test(r[e][s]))return{valid:!1,errorNumber:9,error:t[9]};o+=1,i=!1}if(8!==o)return{valid:!1,errorNumber:10,error:t[10]}}return"3"==o[3][1]&&"w"==o[1]||"6"==o[3][1]&&"b"==o[1]?{valid:!1,errorNumber:11,error:t[11]}:{valid:!0,errorNumber:0,error:t[0]}}function E(e,o,i,r,n,h,l=s.NORMAL){const a=v(r);if(n!==t.PAWN||7!==a&&0!==a)e.push({color:o,from:i,to:r,piece:n,captured:h,promotion:void 0,flags:l});else for(let t=0;t<c.length;t++){const a=c[t];e.push({color:o,from:i,to:r,piece:n,captured:h,promotion:a,flags:l|s.PROMOTION})}}function C(e){let o=e.charAt(0);if(o>="a"&&o<="h"){if(e.match(/[a-h]\d.*[a-h]\d/))return;return t.PAWN}return o=o.toLowerCase(),"o"===o?t.KING:o}function S(e){return e.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}t.validateFen=N,t.Chess=class{constructor(e=t.DEFAULT_POSITION){this._board=new Array(128),this._turn=t.WHITE,this._header={},this._kings={w:o,b:o},this._epSquare=-1,this._halfMoves=0,this._moveNumber=0,this._history=[],this._comments={},this._castling={w:0,b:0},this.load(e)}clear(e=!1){this._board=new Array(128),this._kings={w:o,b:o},this._turn=t.WHITE,this._castling={w:0,b:0},this._epSquare=o,this._halfMoves=0,this._moveNumber=1,this._history=[],this._comments={},this._header=e?this._header:{},this._updateSetup(this.fen())}load(e,i=!1){const n=e.split(/\s+/),h=n[0];let l=0;if(!N(e).valid)return!1;this.clear(i);for(let e=0;e<h.length;e++){const o=h.charAt(e);if("/"===o)l+=8;else if(g(o))l+=parseInt(o,10);else{const e=o<"a"?t.WHITE:t.BLACK;this.put({type:o.toLowerCase(),color:e},_(l)),l++}}return this._turn=n[1],n[2].indexOf("K")>-1&&(this._castling.w|=s.KSIDE_CASTLE),n[2].indexOf("Q")>-1&&(this._castling.w|=s.QSIDE_CASTLE),n[2].indexOf("k")>-1&&(this._castling.b|=s.KSIDE_CASTLE),n[2].indexOf("q")>-1&&(this._castling.b|=s.QSIDE_CASTLE),this._epSquare="-"===n[3]?o:r[n[3]],this._halfMoves=parseInt(n[4],10),this._moveNumber=parseInt(n[5],10),this._updateSetup(this.fen()),!0}fen(){let e=0,i="";for(let o=r.a8;o<=r.h1;o++){if(this._board[o]){e>0&&(i+=e,e=0);const{color:s,type:r}=this._board[o];i+=s===t.WHITE?r.toUpperCase():r.toLowerCase()}else e++;o+1&136&&(e>0&&(i+=e),o!==r.h1&&(i+="/"),e=0,o+=8)}let n="";this._castling[t.WHITE]&s.KSIDE_CASTLE&&(n+="K"),this._castling[t.WHITE]&s.QSIDE_CASTLE&&(n+="Q"),this._castling[t.BLACK]&s.KSIDE_CASTLE&&(n+="k"),this._castling[t.BLACK]&s.QSIDE_CASTLE&&(n+="q"),n=n||"-";const h=this._epSquare===o?"-":_(this._epSquare);return[i,this._turn,n,h,this._halfMoves,this._moveNumber].join(" ")}_updateSetup(e){this._history.length>0||(e!==t.DEFAULT_POSITION?(this._header.SetUp="1",this._header.FEN=e):(delete this._header.SetUp,delete this._header.FEN))}reset(){this.load(t.DEFAULT_POSITION)}get(e){return this._board[r[e]]||!1}put({type:e,color:i},s){if(-1==="pnbrqkPNBRQK".indexOf(e.toLowerCase()))return!1;if(!(s in r))return!1;const n=r[s];return(e!=t.KING||this._kings[i]==o||this._kings[i]==n)&&(this._board[n]={type:e,color:i},e===t.KING&&(this._kings[i]=n),this._updateSetup(this.fen()),!0)}remove(e){const i=this.get(e);return delete this._board[r[e]],i&&i.type===t.KING&&(this._kings[i.color]=o),this._updateSetup(this.fen()),i}_attacked(e,o){for(let i=r.a8;i<=r.h1;i++){if(136&i){i+=7;continue}if(void 0===this._board[i]||this._board[i].color!==e)continue;const s=this._board[i],r=i-o,n=r+119;if(l[n]&u[s.type]){if(s.type===t.PAWN){if(r>0){if(s.color===t.WHITE)return!0}else if(s.color===t.BLACK)return!0;continue}if("n"===s.type||"k"===s.type)return!0;const e=a[n];let h=i+e,l=!1;for(;h!==o;){if(null!=this._board[h]){l=!0;break}h+=e}if(!l)return!0}}return!1}_isKingAttacked(e){return this._attacked(b(e),this._kings[e])}isCheck(){return this._isKingAttacked(this._turn)}inCheck(){return this.isCheck()}isCheckmate(){return this.isCheck()&&0===this._moves().length}isStalemate(){return!this.isCheck()&&0===this._moves().length}isInsufficientMaterial(){const e={b:0,n:0,r:0,q:0,k:0,p:0},o=[];let i=0,s=0;for(let n=r.a8;n<=r.h1;n++){if(s=(s+1)%2,136&n){n+=7;continue}const r=this._board[n];r&&(e[r.type]=r.type in e?e[r.type]+1:1,r.type===t.BISHOP&&o.push(s),i++)}if(2===i)return!0;if(3===i&&(1===e[t.BISHOP]||1===e[t.KNIGHT]))return!0;if(i===e[t.BISHOP]+2){let e=0;const t=o.length;for(let i=0;i<t;i++)e+=o[i];if(0===e||e===t)return!0}return!1}isThreefoldRepetition(){const e=[],t={};let o=!1;for(;;){const t=this._undoMove();if(!t)break;e.push(t)}for(;;){const i=this.fen().split(" ").slice(0,4).join(" ");t[i]=i in t?t[i]+1:1,t[i]>=3&&(o=!0);const s=e.pop();if(!s)break;this._makeMove(s)}return o}isDraw(){return this._halfMoves>=100||this.isStalemate()||this.isInsufficientMaterial()||this.isThreefoldRepetition()}isGameOver(){return this.isCheckmate()||this.isStalemate()||this.isDraw()}moves({verbose:e=!1,square:t}={}){const o=this._moves({square:t});return e?o.map((e=>this._makePretty(e))):o.map((e=>this._moveToSan(e,o)))}_moves({legal:e=!0,piece:o,square:i}={}){var l;const a=i?i.toLowerCase():void 0,u=null==o?void 0:o.toLowerCase(),c=[],d=this._turn,m=b(d);let p=r.a8,g=r.h1,_=!1;if(a){if(!(a in r))return[];p=g=r[a],_=!0}for(let e=p;e<=g;e++){if(136&e){e+=7;continue}if(!this._board[e]||this._board[e].color===m)continue;const{type:o}=this._board[e];let i;if(o===t.PAWN){if(u&&u!==o)continue;i=e+n[d][0],this._board[i]||(E(c,d,e,i,t.PAWN),i=e+n[d][1],f[d]!==v(e)||this._board[i]||E(c,d,e,i,t.PAWN,void 0,s.BIG_PAWN));for(let o=2;o<4;o++)i=e+n[d][o],136&i||((null===(l=this._board[i])||void 0===l?void 0:l.color)===m?E(c,d,e,i,t.PAWN,this._board[i].type,s.CAPTURE):i===this._epSquare&&E(c,d,e,i,t.PAWN,t.PAWN,s.EP_CAPTURE))}else{if(u&&u!==o)continue;for(let r=0,n=h[o].length;r<n;r++){const n=h[o][r];for(i=e;i+=n,!(136&i);){if(this._board[i]){if(this._board[i].color===d)break;E(c,d,e,i,o,this._board[i].type,s.CAPTURE);break}if(E(c,d,e,i,o),o===t.KNIGHT||o===t.KING)break}}}}if(!(void 0!==u&&u!==t.KING||_&&g!==this._kings[d])){if(this._castling[d]&s.KSIDE_CASTLE){const e=this._kings[d],o=e+2;this._board[e+1]||this._board[o]||this._attacked(m,this._kings[d])||this._attacked(m,e+1)||this._attacked(m,o)||E(c,d,this._kings[d],o,t.KING,void 0,s.KSIDE_CASTLE)}if(this._castling[d]&s.QSIDE_CASTLE){const e=this._kings[d],o=e-2;this._board[e-1]||this._board[e-2]||this._board[e-3]||this._attacked(m,this._kings[d])||this._attacked(m,e-1)||this._attacked(m,o)||E(c,d,this._kings[d],o,t.KING,void 0,s.QSIDE_CASTLE)}}if(!e)return c;const N=[];for(let e=0,t=c.length;e<t;e++)this._makeMove(c[e]),this._isKingAttacked(d)||N.push(c[e]),this._undoMove();return N}move(e,{sloppy:t=!1}={}){let o=null;if("string"==typeof e)o=this._moveFromSan(e,t);else if("object"==typeof e){const t=this._moves();for(let i=0,s=t.length;i<s;i++)if(e.from===_(t[i].from)&&e.to===_(t[i].to)&&(!("promotion"in t[i])||e.promotion===t[i].promotion)){o=t[i];break}}if(!o)return null;const i=this._makePretty(o);return this._makeMove(o),i}_push(e){this._history.push({move:e,kings:{b:this._kings.b,w:this._kings.w},turn:this._turn,castling:{b:this._castling.b,w:this._castling.w},epSquare:this._epSquare,halfMoves:this._halfMoves,moveNumber:this._moveNumber})}_makeMove(e){const i=this._turn,r=b(i);if(this._push(e),this._board[e.to]=this._board[e.from],delete this._board[e.from],e.flags&s.EP_CAPTURE&&(this._turn===t.BLACK?delete this._board[e.to-16]:delete this._board[e.to+16]),e.promotion&&(this._board[e.to]={type:e.promotion,color:i}),this._board[e.to].type===t.KING){if(this._kings[i]=e.to,e.flags&s.KSIDE_CASTLE){const t=e.to-1,o=e.to+1;this._board[t]=this._board[o],delete this._board[o]}else if(e.flags&s.QSIDE_CASTLE){const t=e.to+1,o=e.to-2;this._board[t]=this._board[o],delete this._board[o]}this._castling[i]=0}if(this._castling[i])for(let t=0,o=d[i].length;t<o;t++)if(e.from===d[i][t].square&&this._castling[i]&d[i][t].flag){this._castling[i]^=d[i][t].flag;break}if(this._castling[r])for(let t=0,o=d[r].length;t<o;t++)if(e.to===d[r][t].square&&this._castling[r]&d[r][t].flag){this._castling[r]^=d[r][t].flag;break}e.flags&s.BIG_PAWN?i===t.BLACK?this._epSquare=e.to-16:this._epSquare=e.to+16:this._epSquare=o,e.piece===t.PAWN||e.flags&(s.CAPTURE|s.EP_CAPTURE)?this._halfMoves=0:this._halfMoves++,i===t.BLACK&&this._moveNumber++,this._turn=r}undo(){const e=this._undoMove();return e?this._makePretty(e):null}_undoMove(){const e=this._history.pop();if(void 0===e)return null;const o=e.move;this._kings=e.kings,this._turn=e.turn,this._castling=e.castling,this._epSquare=e.epSquare,this._halfMoves=e.halfMoves,this._moveNumber=e.moveNumber;const i=this._turn,r=b(i);if(this._board[o.from]=this._board[o.to],this._board[o.from].type=o.piece,delete this._board[o.to],o.captured)if(o.flags&s.EP_CAPTURE){let e;e=i===t.BLACK?o.to-16:o.to+16,this._board[e]={type:t.PAWN,color:r}}else this._board[o.to]={type:o.captured,color:r};if(o.flags&(s.KSIDE_CASTLE|s.QSIDE_CASTLE)){let e,t;o.flags&s.KSIDE_CASTLE?(e=o.to+1,t=o.to-1):(e=o.to-2,t=o.to+1),this._board[e]=this._board[t],delete this._board[t]}return o}pgn({newline:e="\n",maxWidth:t=0}={}){const o=[];let i=!1;for(const t in this._header)o.push("["+t+' "'+this._header[t]+'"]'+e),i=!0;i&&this._history.length&&o.push(e);const s=e=>{const t=this._comments[this.fen()];return void 0!==t&&(e=`${e}${e.length>0?" ":""}{${t}}`),e},r=[];for(;this._history.length>0;)r.push(this._undoMove());const n=[];let h="";for(0===r.length&&n.push(s(""));r.length>0;){h=s(h);const e=r.pop();if(!e)break;if(this._history.length||"b"!==e.color)"w"===e.color&&(h.length&&n.push(h),h=this._moveNumber+".");else{const e=`${this._moveNumber}. ...`;h=h?`${h} ${e}`:e}h=h+" "+this._moveToSan(e,this._moves({legal:!0})),this._makeMove(e)}if(h.length&&n.push(s(h)),void 0!==this._header.Result&&n.push(this._header.Result),0===t)return o.join("")+n.join(" ");const l=function(){return o.length>0&&" "===o[o.length-1]&&(o.pop(),!0)},a=function(i,s){for(const r of s.split(" "))if(r){if(i+r.length>t){for(;l();)i--;o.push(e),i=0}o.push(r),i+=r.length,o.push(" "),i++}return l()&&i--,i};let u=0;for(let i=0;i<n.length;i++)u+n[i].length>t&&n[i].includes("{")?u=a(u,n[i]):(u+n[i].length>t&&0!==i?(" "===o[o.length-1]&&o.pop(),o.push(e),u=0):0!==i&&(o.push(" "),u++),o.push(n[i]),u+=n[i].length);return o.join("")}header(...e){for(let t=0;t<e.length;t+=2)"string"==typeof e[t]&&"string"==typeof e[t+1]&&(this._header[e[t]]=e[t+1]);return this._header}loadPgn(e,{sloppy:t=!1,newlineChar:o="\r?\n"}={}){function i(e){return e.replace(/\\/g,"\\")}e=e.trim();const s=new RegExp("^(\\[((?:"+i(o)+")|.)*\\])(?:\\s*"+i(o)+"){2}").exec(e),r=s&&s.length>=2?s[1]:"";this.reset();const n=function(e){const t={},s=e.split(new RegExp(i(o)));let r="",n="";for(let e=0;e<s.length;e++){const o=/^\s*\[([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;r=s[e].replace(o,"$1"),n=s[e].replace(o,"$2"),r.trim().length>0&&(t[r]=n)}return t}(r);let h="";for(const e in n)"fen"===e.toLowerCase()&&(h=n[e]),this.header(e,n[e]);if(t){if(h&&!this.load(h,!0))return!1}else if(!("1"!==n.SetUp||"FEN"in n&&this.load(n.FEN,!0)))return!1;const l=function(e){return`{${function(e){return Array.from(e).map((function(e){return e.charCodeAt(0)<128?e.charCodeAt(0).toString(16):encodeURIComponent(e).replace(/%/g,"").toLowerCase()})).join("")}((e=e.replace(new RegExp(i(o),"g")," ")).slice(1,e.length-1))}}`},a=function(e){if(e.startsWith("{")&&e.endsWith("}"))return function(e){return 0==e.length?"":decodeURIComponent("%"+(e.match(/.{1,2}/g)||[]).join("%"))}(e.slice(1,e.length-1))};let u=e.replace(r,"").replace(new RegExp(`({[^}]*})+?|;([^${i(o)}]*)`,"g"),(function(e,t,o){return void 0!==t?l(t):" "+l(`{${o.slice(1)}}`)})).replace(new RegExp(i(o),"g")," ");const c=/(\([^()]+\))+?/g;for(;c.test(u);)u=u.replace(c,"");u=u.replace(/\d+\.(\.\.)?/g,""),u=u.replace(/\.\.\./g,""),u=u.replace(/\$\d+/g,"");let d=u.trim().split(new RegExp(/\s+/));d=d.join(",").replace(/,,+/g,",").split(",");let f="";for(let e=0;e<d.length;e++){const o=a(d[e]);if(void 0!==o){this._comments[this.fen()]=o;continue}const i=this._moveFromSan(d[e],t);if(null==i){if(!(m.indexOf(d[e])>-1))return!1;f=d[e]}else f="",this._makeMove(i)}return f&&Object.keys(this._header).length&&!this._header.Result&&this.header("Result",f),!0}_moveToSan(e,o){let i="";if(e.flags&s.KSIDE_CASTLE)i="O-O";else if(e.flags&s.QSIDE_CASTLE)i="O-O-O";else{if(e.piece!==t.PAWN){const t=function(e,t){const o=e.from,i=e.to,s=e.piece;let r=0,n=0,h=0;for(let e=0,l=t.length;e<l;e++){const l=t[e].from,a=t[e].to;s===t[e].piece&&o!==l&&i===a&&(r++,v(o)===v(l)&&n++,p(o)===p(l)&&h++)}return r>0?n>0&&h>0?_(o):h>0?_(o).charAt(1):_(o).charAt(0):""}(e,o);i+=e.piece.toUpperCase()+t}e.flags&(s.CAPTURE|s.EP_CAPTURE)&&(e.piece===t.PAWN&&(i+=_(e.from)[0]),i+="x"),i+=_(e.to),e.promotion&&(i+="="+e.promotion.toUpperCase())}return this._makeMove(e),this.isCheck()&&(this.isCheckmate()?i+="#":i+="+"),this._undoMove(),i}_moveFromSan(e,t=!1){const o=S(e);let i,s,n,h,l,a=C(o),u=this._moves({legal:!0,piece:a});for(let e=0,t=u.length;e<t;e++)if(o===S(this._moveToSan(u[e],u)))return u[e];if(!t)return null;let c=!1;s=o.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/),s?(i=s[1],n=s[2],h=s[3],l=s[4],1==n.length&&(c=!0)):(s=o.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/),s&&(i=s[1],n=s[2],h=s[3],l=s[4],1==n.length&&(c=!0))),a=C(o),u=this._moves({legal:!0,piece:i||a});for(let e=0,t=u.length;e<t;e++)if(n&&h){if(!(i&&i.toLowerCase()!=u[e].piece||r[n]!=u[e].from||r[h]!=u[e].to||l&&l.toLowerCase()!=u[e].promotion))return u[e];if(c){const t=_(u[e].from);if(!(i&&i.toLowerCase()!=u[e].piece||r[h]!=u[e].to||n!=t[0]&&n!=t[1]||l&&l.toLowerCase()!=u[e].promotion))return u[e]}}return null}ascii(){let e="   +------------------------+\n";for(let o=r.a8;o<=r.h1;o++){if(0===p(o)&&(e+=" "+"87654321"[v(o)]+" |"),this._board[o]){const i=this._board[o].type;e+=" "+(this._board[o].color===t.WHITE?i.toUpperCase():i.toLowerCase())+" "}else e+=" . ";o+1&136&&(e+="|\n",o+=8)}return e+="   +------------------------+\n",e+="     a  b  c  d  e  f  g  h",e}perft(e){const t=this._moves({legal:!1});let o=0;const i=this._turn;for(let s=0,r=t.length;s<r;s++)this._makeMove(t[s]),this._isKingAttacked(i)||(e-1>0?o+=this.perft(e-1):o++),this._undoMove();return o}_makePretty(e){const{color:t,piece:o,from:r,to:n,flags:h,captured:l,promotion:a}=e;let u="";for(const e in s)s[e]&h&&(u+=i[e]);const c={color:t,piece:o,from:_(r),to:_(n),san:this._moveToSan(e,this._moves({legal:!0})),flags:u};return l&&(c.captured=l),a&&(c.promotion=a),c}turn(){return this._turn}board(){const e=[];let t=[];for(let o=r.a8;o<=r.h1;o++)null==this._board[o]?t.push(null):t.push({square:_(o),type:this._board[o].type,color:this._board[o].color}),o+1&136&&(e.push(t),t=[],o+=8);return e}squareColor(e){if(e in r){const t=r[e];return(v(t)+p(t))%2==0?"light":"dark"}return null}history({verbose:e=!1}={}){const t=[],o=[];for(;this._history.length>0;)t.push(this._undoMove());for(;;){const i=t.pop();if(!i)break;e?o.push(this._makePretty(i)):o.push(this._moveToSan(i,this._moves())),this._makeMove(i)}return o}_pruneComments(){const e=[],t={},o=e=>{e in this._comments&&(t[e]=this._comments[e])};for(;this._history.length>0;)e.push(this._undoMove());for(o(this.fen());;){const t=e.pop();if(!t)break;this._makeMove(t),o(this.fen())}this._comments=t}getComment(){return this._comments[this.fen()]}setComment(e){this._comments[this.fen()]=e.replace("{","[").replace("}","]")}deleteComment(){const e=this._comments[this.fen()];return delete this._comments[this.fen()],e}getComments(){return this._pruneComments(),Object.keys(this._comments).map((e=>({fen:e,comment:this._comments[e]})))}deleteComments(){return this._pruneComments(),Object.keys(this._comments).map((e=>{const t=this._comments[e];return delete this._comments[e],{fen:e,comment:t}}))}}}},t={};function o(i){var s=t[i];if(void 0!==s)return s.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,o),r.exports}(()=>{var e=o(176);var t=e.getAgent("random",0,!0),i=null,s=!1,r=!1,n=!0;const h=o(938);var l=new h.Chess,a=0;i=Chessboard("myBoard",{draggable:!0,position:"start",onDragStart:_,onDrop:N});var u,c=!0;u="LightMCTS",t=e.getAgent(u,g,!c);var d=document.getElementById("timeSlider");d.oninput=function(){var e;e=d.value/d.max*9.9+.1,null!=t&&t.hasTimeLimit&&(document.getElementById("Thinking").innerHTML="Thinking Time: "+Math.round(10*e)/10+"s",t.setTimeLimit(e))};let f=1;var m=document.getElementById("colorButton"),v=document.getElementById("resetButton");function p(){let e=0;e+=document.getElementById("HeadingDiv").offsetHeight,e+=document.getElementById("FooterDiv").offsetHeight;let t=Math.min(1*window.innerWidth,1*(window.innerHeight-e));document.getElementById("FooterHolder").style.width=t+"px",document.getElementById("FooterHolder").style.marginLeft=(window.innerWidth-t)/2+"px",document.getElementById("myBoard").style.width=t+"px",document.getElementById("colorButton").style.marginLeft="0px",document.getElementById("resetButton").style.marginLeft=t-document.getElementById("resetButton").offsetWidth+"px",i.resize()}function g(){return++a}function _(e,t,o,i){return!l.isGameOver()&&!!n&&(!c||-1===t.search(/^b/))&&!(!c&&-1!==t.search(/^w/))&&void 0}function b(){k=!0,l.isGameOver()?console.log("Game over"):window.setTimeout(E,15),r=!1,n=!1,window.setTimeout(S,15)}function N(e,t){var o=!1,s=null;if(firstLetter=t.split("")[1],firstLetter!==8..toString()&&"1"!==firstLetter||(piece=l.get(e),"p"===piece.type&&(o=!0,s=l.move({from:e,to:t,promotion:"q"}))),o||(s=l.move({from:e,to:t})),null===s)return"snapback";n=!1,"O-O"==s.san||"O-O-O"==s.san?window.setTimeout((function(){i.position(l.fen()),window.setTimeout(b,200)}),200):b()}function E(){s=!0}function C(){if(t.WorB=c,c=!c)e={draggable:!0,position:"start",onDragStart:_,onDrop:N},k=!0,i=Chessboard("myBoard",e),n=!0;else{var e={draggable:!0,position:"start",orientation:"black",onDragStart:_,onDrop:N};i=Chessboard("myBoard",e),k=!0,window.setTimeout(w(),250),n=!0}}function S(){i.position(l.fen()),r=!0}function T(){}function w(){moves=null,t.requiresVerbose?moves=l.moves({verbose:!0}):moves=l.moves(),nextMove=t.selectMove(l,moves,moveNumber=f),f++,l.move(nextMove),l.isGameOver()&&console.log("Game over"),window.setTimeout(S,0),window.setTimeout(T,50),window.setTimeout((function(){n=!0}),100)}p(),window.addEventListener("resize",(()=>{p()})),navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)?console.log("Mobile"):console.log("Desktop"),m.addEventListener("click",(function(){!function(){if(k){if(!(2==f&&t.WorB||"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"==l.fen()))return;f=1,l=new h.Chess,i.position(l.fen()),window.setTimeout(C,500)}else C()}()}),!1),v.addEventListener("click",(function(){l=new h.Chess,i.position(l.fen()),n=!0,k=!1,f=1,t.WorB&&window.setTimeout(b,400)}),!1),startDate=Date.now(),window.onload=function(){setInterval((function(){s?A<10?A++:r&&(w(),s=!1,A=0):k&&t.offlineTreeBuilding}),0)};var A=0,k=!1})()})();