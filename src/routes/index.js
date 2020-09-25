import { getPrice, joinList, buy, sendFuckYou } from '../controllers';

function initRoutes(router) {
    router.get("/getPrice", getPrice);
    router.post("/joinList", joinList);
    router.post("/buy", buy);
    router.post("/fuck-you", sendFuckYou)
}

export default initRoutes;