import { getPrice, joinList, buy, sendFuckYou } from '../controllers';

function initRoutes(router) {
    router.get("/get-price", getPrice);
    router.post("/join-list", joinList);
    router.post("/buy", buy);
    router.post("/fuck-you", sendFuckYou)
}

export default initRoutes;