import kotlin.io.path.Path
import kotlin.io.path.readLines


data class Hand(var cards: List<Int> = emptyList()) {
    
    var bid: Int = 0
    var raw: String = ""
    var sorted: String = ""

    val type get(): Int {
        return this.bid * 1000
    }

    companion object {
        val cardKyes = "AKQJT98765432".toSet()
        val cardValues = listOf(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41)
            .reversed()

        val cardsMap: Map<Char, Int> = 
                cardKyes.zip(cardValues.asIterable())
                    .toMap()

        val cardsMapInverse: Map<Int, Char> = 
                cardValues.zip(cardKyes.asIterable())
                    .toMap()

        
    }

    constructor(
        cards: List<Int> = emptyList(),
        bid: Int = 0,
        raw: String = "",
    ): this(cards) {
        this.bid = bid
        this.raw = raw        
    }

    constructor(raw: String): this() {
        val (strCards, strBid) = raw.split(" ")
        this.raw = strCards
        this.bid = strBid.toInt()
        this.cards = strCards.toList().map { Hand.cardsMap[it] ?: 0 }
        this.sort()
    }

    fun sort(): Unit {
        this.cards = this.cards.sortedBy { it }
    }

    override fun toString(): String {
        val cardChars = this.cards.map { Hand.cardsMapInverse[it] ?: "" }
        val handStr = cardChars.joinToString(separator = "")
        return handStr + ": " + this.bid.toString()
    }

    fun countRepetitions() {

    }
}


/**
 * Reads lines from the given input txt file.
 */
fun readInput(path: String): List<String> = Path("$path").readLines()


fun main() {
    // val inputFilePath = "input.txt"
    val inputFilePath = "input.sample.txt"
    
    // println(Hand.cardsMapInverse)

    val lines = readInput(inputFilePath)

    val hands = lines.filter { it.trim().length > 0 }
                    .map { Hand(it) }
                    .sortedBy{ it.bid }

    for (h in hands) {
        println(h.type)
    }

    // Types of hands, from strongest to weakest:
    // FOR SORTED STRINGS
    // - 5 of a kind: ([AKQJT2-9])\1{4}
    // - 4 of a kind: ([AKQJT2-9])\1{3}
    // - Full house: ...
    // - 3 of a kind: ([AKQJT2-9])\1{2}
    // - two pairs: ([AKQJT2-9])\1{1} - two matches
    // - one pair: ([AKQJT2-9])\1{1} - one match
    // - High card: ...
    //

    // Number of combinations:
    // AKQJT98765432
    // ×
    // 12345
    //
    // - 5 of a kind: 13 combinations
    // - 4 of a kind: 13 * 12 = 156 combinations
    // - Full house: (3 of a kind + 2 of a kind): 13 * 12 = 156
    // - 3 of a kind: 13 * 12 * 11 = 1716 combinations
    // - two pairs: 13 * 12 * 11 = 1716 combinations
    // - one pair: 13 * 12 * 11 * 10 = 17160 combinations
    // - High card: 13 * 12 * 11 * 10 * 9 = 154440 combinations
    // 
    


}