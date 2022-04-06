function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawOppHand(game, animated_deck, opp, cont, seed){
    for (var i = 0; i < game.cards_dealt; i++){
        newCard = new Card(6 + i, 0 + seed).look(animated_deck); 
        newCard.mount(cont);
        newCard.animateTo({
            delay: 200 + i * 40, // wait 1 second + i * 2 ms
            duration: 100,
            ease: 'quartOut',
            x: -10 * game.cards_dealt + i * 20,
            y: 0,
        });
        opp.push(newCard);
    }            
    return opp;
}

function drawOpponentCards(game, animatedDeck, opp){

    
    all = [];
    one = drawOppHand(game, animatedDeck, opp, $leftPlayer,1);
    two = drawOppHand(game, animatedDeck, opp, $topPlayer, 2);
    three = drawOppHand(game, animatedDeck, opp, $rightPlayer, 3);
    all.push(one);
    all.push(two);
    all.push(three);
    return all;
}

function drawPlayerCardsAux(game, card_container,number, added, animated_deck){
    card = game.users[0].cards[number - 1].look(animated_deck);
    // console.log(card);
    card.mount(card_container);
    card.setSide('front')
    added.push(card);
    return added;
}

function drawWild(card, animatedDeck){
    acc = [];
    deck_place = new Card(7, 1).look(animatedDeck);
    deck_place.mount($deck);
    deck_place.animateTo({
        delay: 100,
        duration: 10,

        ease: 'quartOut',
        x: 3,
        y: -5
    });
    if (card === new Card(0, 4)){
        animatedCard = animatedDeck.cards[52];
    } else {
        animatedCard = card.look(animatedDeck);
    }
    animatedCard.setSide('front');
    animatedCard.mount($deck);
    acc.push(animatedCard);
    acc.push(deck_place);
    
    return acc;
}

function space_out(added, len){
    added.forEach(function (card, i) {
        card.setSide("front");
        card.animateTo({
            delay: 10 + 2 * i, // wait 1 second + i * 2 ms
            duration: 200,

            ease: 'quartOut',
            x: added.length * -27 + (i * 30),
            y: 0
        });
    });
}

function clearPlayerCards(){
    $card1.innerHTML = "";
    $card2.innerHTML = "";
    $card3.innerHTML = "";
    $card4.innerHTML = "";
    $card5.innerHTML = "";
    $card6.innerHTML = "";
    $card7.innerHTML = "";
    $card8.innerHTML = "";
    $card9.innerHTML = ""; 
}

function drawPlayerCards(game, animated_deck){
    // clearPlayerCards();
    switch (game.users[0].cards.length) {
        case 1:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added[0].setSide('front');
            break;
        case 2:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            
            space_out(added, game.cards_dealt);
            break;
        case 3:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            
            space_out(added, game.cards_dealt);
            break;
        case 4:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            added = drawPlayerCardsAux(game, $card4, 4, added, animated_deck);

            space_out(added, game.cards_dealt);
            break;
        case 5:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            added = drawPlayerCardsAux(game, $card4, 4, added, animated_deck);
            added = drawPlayerCardsAux(game, $card5, 5, added, animated_deck);
            
            space_out(added, game.cards_dealt);
            break;
        case 6:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            added = drawPlayerCardsAux(game, $card4, 4, added, animated_deck);
            added = drawPlayerCardsAux(game, $card5, 5, added, animated_deck);
            added = drawPlayerCardsAux(game, $card6, 6, added, animated_deck);
            
            space_out(added, game.cards_dealt);
            break;
        case 7:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            added = drawPlayerCardsAux(game, $card4, 4, added, animated_deck);
            added = drawPlayerCardsAux(game, $card5, 5, added, animated_deck);
            added = drawPlayerCardsAux(game, $card6, 6, added, animated_deck);
            added = drawPlayerCardsAux(game, $card7, 7, added, animated_deck);
            

            space_out(added, game.cards_dealt);
            break;
        case 8:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            added = drawPlayerCardsAux(game, $card4, 4, added, animated_deck);
            added = drawPlayerCardsAux(game, $card5, 5, added, animated_deck);
            added = drawPlayerCardsAux(game, $card6, 6, added, animated_deck);
            added = drawPlayerCardsAux(game, $card7, 7, added, animated_deck);
            added = drawPlayerCardsAux(game, $card8, 8, added, animated_deck);
            
            
            space_out(added, game.cards_dealt);
            break;
        case 9:
            added = drawPlayerCardsAux(game, $card1, 1, added, animated_deck);
            added = drawPlayerCardsAux(game, $card2, 2, added, animated_deck);
            added = drawPlayerCardsAux(game, $card3, 3, added, animated_deck);
            added = drawPlayerCardsAux(game, $card4, 4, added, animated_deck);
            added = drawPlayerCardsAux(game, $card5, 5, added, animated_deck);
            added = drawPlayerCardsAux(game, $card6, 6, added, animated_deck);
            added = drawPlayerCardsAux(game, $card7, 7, added, animated_deck);
            added = drawPlayerCardsAux(game, $card8, 8, added, animated_deck);
            added = drawPlayerCardsAux(game, $card9, 9, added, animated_deck);
            
            space_out(added, game.cards_dealt);
            break;
        
    }
    return added;
}

function removePlayerCards(added){
    console.log(added);
    added.forEach(
        function(toUnmount, i){
            toUnmount.unmount();
        }
    );
}

function playUserCard(anim_card){
    anim_card.unmount();
    anim_card.mount($player0Played);
    anim_card.setSide('front');
}

function playOppCard(opp_num){
    switch (opp_num){
        case 1:
            
    }
}

class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }
    
    look(animatedDeck){
        if (this.value == 0){
            return animatedDeck.cards[52];
        } else if (this.value === 15){
            return animatedDeck.cards[53 + (this.suit % 2)];
        } else {
            return animatedDeck.cards[51 - (this.suit * 13) - (14 - this.value)];
        }
    }
}

class StandardJokerDeck {
    constructor() {
        this.suits = [0, 1, 2, 3]; // Diamonds, Clubs, Hearts, Spades
        this.values = [7, 8, 9, 10, 11, 12, 13, 14];
        this.cards = [];
        for (var i = 0; i < 4; i++){ // suits 0 - 3 (H,D,S,C)
            for (var j = 7; j < 15; j++){ // values 7 - Ace
                this.cards.push(new Card(j, i));
            }
        }
        
        // Add Sixes
        this.cards.push(new Card(6, 0));
        this.cards.push(new Card(6, 2));
    
        // Add Jokers
        this.cards.push(new Card(15, 1));
        this.cards.push(new Card(15, 2));
    }

    shuffle(){
        this.cards.sort(() => (Math.random() > .5) ? 1 : -1);
    }

    get(index){
        return this.cards[index];
    }
    
    deal(location, number){
        for(var i = 0; i < number; i++)
        location.push(this.cards.pop());
    }
}

class Player {
    constructor(id_in){
        this.id = id_in;
        this.score = 0;
        this.cards = [];
        this.called = 0;
        this.taken = 0;
    }
}

class Game { 
    constructor() { 
        this.deck = new StandardJokerDeck();
        this.wildcard = new Card(0,4);
        this.first_suit = 5;
        this.cards_dealt = 0;
        this.round = 0;
        this.play = 0;
        this.users = [new Player(0), new Player(1), new Player(2), new Player(3)];
        this.dealer = Math.floor(Math.random() * 4);
        // this.simulation = Boolean(false);
        // this.model = None
    }

    get_wildcard(){
        return this.wildcard;
    }

    get_place_in_playing_order(player_id){
        var dealer = this.dealer;
        var out = 5;
        for (var i = 1; i < 6; i++){
            if ((dealer + i) % 4 == player_id){
                out = i;
            }
        }
        return out;
    }

    get_wildsuit(){
        if (this.get_wildcard().value != 15){
            return this.get_wildcard().suit;
        } else {
            return 4;
        }
    }

    set_dealer(){
        this.dealer = (this.dealer + 1) % 4;
    }

    update_round(){ 
        this.set_dealer();
        
        if (this.round == 1 && this.play == 8){
            this.round += 1;
            this.play = 1;
        } else if (this.round == 0 && this.play == 0) {
            this.round = 1;
            this.play = 1;
        } else if (this.round == 2 && this.play == 4) {
            this.round = 3;
            this.play = 1;
        } else if (this.round == 3 && this.play == 8 ) {
            this.round = 4;
            this.play = 1;
        } else {
            this.play += 1;
        }

        if (this.round == 1) {
            this.cards_dealt = this.play;
        } else if (this.round == 3){
            this.cards_dealt = 9 - this.play;
        }else {
            this.cards_dealt = 9;
        }
    }

    display_calls(user, called){
        switch(user){
            case 0:
                $called0.innerHTML = called + "";
                break;
            case 1:
                $called1.innerHTML = called + "";
                break;
            case 2:
                $called2.innerHTML = called + "";
                break;
            case 3:
                $called3.innerHTML = called + "";
                break
                        
        }
    }

    set_calls(u0, u1, u2, u3){
        this.users[0].called = u0;
        this.users[1].called = u1;
        this.users[2].called = u2;
        this.users[3].called = u3;

        this.display_calls(0, u0);
        this.display_calls(1, u1);
        this.display_calls(2, u2);
        this.display_calls(3, u3);

    }

    get_play_index_of_game(){
        if (this.round == 1) {
            return (this.play - 1);
        } else if (this.round == 2) {
            return (this.play + 7);
        } else if (this.round == 3) {
            return (this.play + 11);
        } else if (this.round == 4) {
            return (this.play + 19);
        } else {
            return 100;
        }
    }

    deal_to_users(){
        this.deck = new StandardJokerDeck();
        this.deck.cards = this.deck.cards.sort(() => (Math.random() > .5) ? 1 : -1);
        for (var i = 0; i < 4; i++) {
            this.deck.deal(this.users[i].cards, this.cards_dealt);
        }
    }
    
    set_wildcard() {
        var choice, choices;

        if (this.round === 2 || this.round === 4) {
            this.wildcard = new Card(0, 4);
            // choices = this.users[(this.dealer + 1) % 4].cards.slice(0, 3); TEMPORARILY COMMENTED OUT
            // choice = this.get_wild_choice(choices, this.dealer);
            // this.wildcard = choices[choice];
        } else {
            this.wildcard = this.deck.cards[0];
        }
    }

    card_to_weight(card) {
        var weight;
        weight = 0;

        if (card.suit === this.get_wildsuit()) {
            weight += 200;
        } else {
            if (card.suit === this.first_suit) {
            weight += 100;
            }
        }

        if (card.value ===  15) {
            weight += 400;
        } else {
            weight += (card.value);
        }

        return weight;
    }

    compute_winner(played) {
        var jok, joks, weights;
        jok = 5;
        joks = 0;

        for (var i = 1; i < 5; i += 1) {
            if (played[(this.dealer + i) % 4].value ===  15) {
                jok = (this.dealer + i) % 4;
                joks += 1;
            }
        }

        if (joks === 2) {
            return jok;
        } else {
            weights = [];

            for (var i = 0; i < 4; i++) {
                weights.push(this.card_to_weight(played[i]));
            }

            return weights.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
        }
    }

    playable(player, wildsuit, first_suit) {
        var firsts, joks, wilds;
        firsts = (this.users[player].cards.filter(x => {
            return (x.suit === first_suit && !(x.value ===  15));
        }));
        wilds =  (this.users[player].cards.filter(x => {
            return x.suit === wildsuit && !(x.value ===  15);
        }));
        joks =  (this.users[player].cards.filter(x => {
            return x.value ===  15;
        }));

        if (this.first_suit === null) {
            return this.users[player].cards;
        } else {
            if (firsts.length === 0) {
                if (wilds.length === 0) {
                    return this.users[player].cards;
                } else {
                    for (var i = 0; i < joks.length; i++) {
                        wilds.push(joks[i]);
                    }
                    return wilds;
                }
            } else {
                for (var i = 0; i < joks.length; i++) {
                    firsts.push(joks[i]);
                }
                return firsts;
            }
        }
    }

    reset_users() {
        for (var i = 0; i < this.users.length; i += 1) {
            this.users[i].called = 0;
            this.users[i].taken = 0;
            this.users[i].cards = [];
        }
    }

    get_player_score(player_id) {
        var called, player, taken;
        player = this.users[player_id];
        called = player.called;
        taken = player.taken;

        if (taken === 0 && called > 0) {
            return -200;
        } else {
            if (taken !== called) {
                return taken * 10;
            } else {
                if (taken === this.cards_dealt) {
                    return taken * 100;
                } else {
                    return taken * 50 + 50;
                }
            }
        }
    }

    async set_player_calls() {
        var already, call, calls, id;
        calls = Array(4);
        already = 0;

        for (var i = 1; i < 5; i += 1) {
            id = (this.dealer + i) % 4;
            if (id === 0){
                while (numSelected < 0){
                    await sleep(1000);
                }
                call = numSelected;
                console.log('numselecred')
                console.log(numSelected);
                numSelected = -1;
            } else if (i === 4) {
                call = this.get_random_call(already);
            } else {
                call = this.get_random_call(null);
                already += call;
            }
            calls[id] = (call);
        }
        console.log('calls');
        console.log(calls);
        this.set_calls(calls[0], calls[1], calls[2], calls[3]);
    }
    
    get_random_call(already) {
        var cap, rand;
        cap = 0;
        cap = this.cards_dealt;
        rand = Math.floor(Math.random() * (cap + 1));

        if (already !== null) {
            while (rand === this.cards_dealt - already) {
                rand = Math.floor(Math.random() * (cap + 1));
            }
        }
        return rand;
    }
    
    set_predicted_calls(model) {
        var adder, call, calls, player, wild;
        calls = [0,0,0,0];

        for (var i = 1; i < 4; i += 1) {
            player = (this.dealer + i) % 4;

            if (player === 0) {
                call = this.ask_call(this.cards_dealt);
            } else {
                

                adder = 0;

                for (var j = 0; j < i - 1; j += 1) {
                    adder += this.users[(player - j) % 4].called;
                }

                call = this.get_prediction(this.cards_dealt);
            }

            calls[(this.dealer + i) % 4] = call;
            this.set_calls(calls[0], calls[1], calls[2], calls[3]);
        }
    }

    get_wild_choice(){ // ??????
        return 0;
    }

    get_weakest(cards) {
        var weakest;
        weakest = cards[0];

        if (cards.length === 1) {
            return weakest;
        } else {
            for (var i = 0; i < cards.length; i += 1) {
                if (cards[i].value < weakest.value) {
                    weakest = cards[i];
                }
            }
            return weakest;
        }
    }

    get_strongest(cards) {
        var non_joks, strongest;
        strongest = cards[0];

        if (cards.length === 1) {
            return strongest;
        } else {
            non_joks =  (cards.filter(x => {return x.value !==  15;}, cards));

            if (non_joks.length === 0) {
                return strongest;
            }

            for (var i = 0; i < cards.length; i++) {
                if (cards[i].value > strongest.value && cards[i].value !==  15) {
                    strongest = cards[i];
                }
            }

            return strongest;
        }
    }

    get_card_choice(player_id, played, starter) {
        var aggressive, beatable, cards, contains_wild, player;
        player = this.users[player_id];
        cards = this.playable(player_id, this.get_wildsuit(), this.first_suit);

        if (player_id === starter) {
            if (cards.length === player.called - player.taken){             
                return this.get_strongest(cards);
            } else {    
                return this.get_weakest(cards);
            }
        } else {
            beatable = true;
            aggressive = player.taken !== player.called;
            contains_wild = false;

            for (var i = 0; i < played.length; i++) {
                if (played[i].suit === this.get_wildsuit()) {
                    contains_wild = true;

                    if ( (cards.filter(x => {return x.suit === this.get_wildsuit() && x.value > played[i].value;})).length === 0) {
                        beatable = false;
                    }
                }
            }

            if (!contains_wild) {
                var highest = new Card(0, 5);
                for (var i = 0; i < played.length; i++){
                    if (played[i] == this.first_suit && played[i].value > highest.value){
                        played[i] = highest;   
                    }
                }
                if ( (cards.filter(x => {
                return x.suit === this.first_suit && x.value > highest.value;
                })).length === 0) {
                    beatable = false;
                } else {
                    beatable = true;
                }
            }

            if (beatable && aggressive) {
                return this.get_strongest(cards);
            } else {
                return this.get_weakest(cards);
            }
        }
    }

    async ask_call(max){ // temp
        while (numSelected < 0){
            await sleep(300);
        }
        return numSelected;
    }

    get_prediction(max){ // temp
        return Math.floor(Math.random() * (max + 1));
    }

    ask_card_choice(){
        return 0;
    }

    // playing_phase() {
    //     var choice, choices, played, player, starter;
    //     starter = (this.dealer + 1) % 4;
    //     this.wildcard = new Card(0, 4);

    //     for (var i = 0; i < this.cards_dealt; i += 1) {
    //         this.first_suit = null;
    //         played = [];

    //         for (var j = 0; j < 4; j += 1) {
    //             player = (starter + j) % 4;
    //             choices = this.playable(player, this.get_wildsuit(), this.first_suit);
    //             if (player === 0) {
    //                 choices = this.playable(player, this.get_wildsuit(), this.first_suit);
    //                 choice = choices[this.ask_card_choice(choices.length)];
    //             } else {
    //                 choice = this.get_card_choice(player, played, starter);
    //             }

    //             this.users[player].cards.filter(function(x){x != choice});
    //             played.push(choice);

    //             if (j === 0) {
    //                 this.first_suit = choice.suit;
    //             }
    //         }

    //         played = played.slice(4 - starter) + played.slice(0, 4 - starter);
    //         starter = this.compute_winner(played);
    //         this.users[starter].taken += 1;
    //         this.first_suit = null;
    //     }

    //     for (var i = 0; i < 4; i += 1) {
    //         this.users[i].score += this.get_player_score(i);
    //     }
    // }
}

async function playing_phase(game, added){
    var choice, choices, played, player, starter;
    starter = (game.dealer + 1) % 4;
    game.wildcard = new Card(0, 4);

    for (var i = 0; i < game.cards_dealt; i += 1) {
        $player0Played.innerHTML = "";
        game.first_suit = null;
        played = [];

        for (var j = 0; j < 4; j += 1) {
            player = (starter + j) % 4;
            choices = game.playable(player, game.get_wildsuit(), game.first_suit);
            if (player === 0) {
                while (numSelected < 0){
                    await sleep(1000);
                }
                choice = choices[numSelected - 1];
                anim_card = choice.look(Deck(true));
                playUserCard(anim_card);
                numSelected = -1;
                removePlayerCards(added);
                // console.log('prefilter');
                // console.log(added);
                // console.log('card');
                // console.log(anim_card);
                added = added.filter((x) => {console.log(x);return x.pos != anim_card.pos});
                // console.log('added');
                // console.log(added);
                // console.log("player cards")
                // console.log(game.users[player].cards);
                // console.log('choice');
                // console.log(choice);
                game.users[player].cards = game.users[player].cards.filter(function(x){return x != choice});
                drawPlayerCards(game, Deck(true));
            } else {
                await sleep(300);
                choice = game.get_card_choice(player, played, starter);
                anim_card = choice.look(Deck(true));
                // removePlayerCards(added);
                game.users[player].cards.filter(function(x){x != choice});
                drawOpponentCards(game,Deck(true),[]);

            }

            
            played.push(choice);

            if (j === 0) {
                game.first_suit = choice.suit;
            }
        }
        played = played.slice(4 - starter) + played.slice(0, 4 - starter);
        starter = game.compute_winner(played);
        game.users[starter].taken += 1;
        game.first_suit = null;
    }

    for (var i = 0; i < 4; i += 1) {
        game.users[i].score += game.get_player_score(i);
    }
    return added;
}

start = false;
cardChosen = false;
numSelected = -1;
game = new Game();

async function run() {
    dt = 900;
    added = [];
    opp = [];
    tmp_rd = 10;
    // while (!start){
    //     await sleep(dt); 
    // }
    for (var i = 0; i < tmp_rd; i += 1) {
        console.log("play " + (i + 1));
        game.update_round();
        game.deal_to_users();
        added = drawPlayerCards(game, Deck(true));
        all_opps = drawOpponentCards(game, Deck(true), opp);
        game.set_wildcard();
        wild = drawWild(game.wildcard, Deck(true));
        game.set_player_calls();
        added = await playing_phase(game, added);
        await sleep(dt); 
        if (i < tmp_rd - 1){removePlayerCards(added);}
        if (i < tmp_rd - 1){removePlayerCards(all_opps[0]);removePlayerCards(all_opps[1]);removePlayerCards(all_opps[2]);}
        if (i < tmp_rd - 1){removePlayerCards(wild);}
        game.reset_users();
    }
}

async function reset() {
    await sleep(dt); 
    if (i < tmp_rd - 1){removePlayerCards(added);}
    if (i < tmp_rd - 1){removePlayerCards(opp);}
    if (i < tmp_rd - 1){wild.unmount();}
    game.reset_users();
}

var $card1 = document.getElementById('card1');
var $card2 = document.getElementById('card2');
var $card3 = document.getElementById('card3');
var $card4 = document.getElementById('card4');
var $card5 = document.getElementById('card5');
var $card6 = document.getElementById('card6');
var $card7 = document.getElementById('card7');
var $card8 = document.getElementById('card8');
var $card9 = document.getElementById('card9');

var $leftPlayer = document.getElementById('leftPlayer');
var $topPlayer = document.getElementById('topPlayer');
var $rightPlayer = document.getElementById('rightPlayer');
var $deck = document.getElementById('deck');

var $player0Played = document.getElementById('player0Played');
var $player1Played = document.getElementById('player1Played');
var $player2Played = document.getElementById('player2Played');
var $player3Played = document.getElementById('player3Played');

var $player0Called = document.getElementById('player0Called');
var $player1Called = document.getElementById('player1Called');
var $player2Called = document.getElementById('player2Called');
var $player3Called = document.getElementById('player3Called');

var gameDeck = Deck(true);

var $topbar = document.getElementById('topbar');

var $sort = document.createElement('button');
var $start = document.createElement('button');
var $bysuit = document.createElement('button');
var $fan = document.createElement('button');
var $poker = document.createElement('button');
var $flip = document.createElement('button');

var $called0 = document.getElementById('called0');
var $called1 = document.getElementById('called1');
var $called2 = document.getElementById('called2');
var $called3 = document.getElementById('called3');

$start.textContent = 'Start';
$sort.textContent = 'Sort';
$bysuit.textContent = 'By suit';
$fan.textContent = 'Fan';
$poker.textContent = 'Poker';
$flip.textContent = 'Flip';

$topbar.appendChild($flip);
$topbar.appendChild($start);
$topbar.appendChild($bysuit);
$topbar.appendChild($fan);
$topbar.appendChild($poker);
$topbar.appendChild($sort);

$start.addEventListener('click', function start(){run(); start = true;});

{run(); start = true;}

$card1.addEventListener('click', function handleClick(){ numSelected = 1;console.log("Card 1 Clicked!");});
$card2.addEventListener('click', function handleClick(){numSelected = 2;console.log('Card 2 Clicked!');});
$card3.addEventListener('click', function handleClick(){numSelected = 3;console.log('Card 3 Clicked!');});
$card4.addEventListener('click', function handleClick(){numSelected = 4;console.log("Card 4 Clicked!")});
$card5.addEventListener('click', function handleClick(){numSelected = 5;console.log("Card 5 Clicked!")});
$card6.addEventListener('click', function handleClick(){numSelected = 6;console.log("Card 6 Clicked!")});
$card7.addEventListener('click', function handleClick(){numSelected = 7;console.log("Card 7 Clicked!")});
$card8.addEventListener('click', function handleClick(){numSelected = 8;console.log("Card 8 Clicked!")});
$card9.addEventListener('click', function handleClick(){numSelected = 9;console.log("Card 9  Clicked!")});

document.addEventListener('keydown', function(event) {
    switch(event.key){
        case '1':
            numSelected = 1;
			console.log(1);
			break;
        case '2':
			numSelected = 2;
			console.log(2);
			break;
        case '3':
            numSelected = 3;
			console.log(3);
			break;
        case '4':
            numSelected = 4;
			console.log(4);
			break;
        case '5':
            numSelected = 5;
			console.log(5);
			break;
        case '6':
            console.log(6);
			break;
        case '7':
            numSelected = 7;
			console.log(7);
			break;
        case '8':
            numSelected = 8;
			console.log(8);
			break;
        case '9':
            numSelected = 9;
			console.log(9);
			break;
        case '0':
            numSelected = 0;
			console.log(0);
			break;
    }
});
