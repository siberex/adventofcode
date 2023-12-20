import kotlin.Comparable
import kotlin.io.path.Path
import kotlin.io.path.readLines
import kotlin.math.min


const val INPUT_FILE_PATH = "input.txt"
// const val INPUT_FILE_PATH = "input.sample.txt"


const val CARDS_PATTERN = "AKQJT98765432"
const val CARDS_PATTERN_WILD = "AKQT98765432J"


// There are 7 types of hands, from strongest to weakest:
// - 5 of a kind: AAAAA
// - 4 of a kind: AA8AA
// - Full house (2 of a kind + 3 of a kind): 23332
// - 3 of a kind: TTT98
// - two pairs: 23432
// - one pair: A23A4
// - High card: each different, 23456
enum class HandType(val pattern: String) {
    FIVE_OF_A_KIND("5"),
    FOUR_OF_A_KIND("14"),
    FULL_HOUSE("23"),
    THREE_OF_A_KIND("113"),
    TWO_PAIRS("122"),
    ONE_PAIR("1112"),
    HIGH_CARD("11111"),
    UNKNOWN("xxx");

    companion object {
        const val WILDCARD = 'J'

        private fun countUniqueChars(str: String): Map<Char, Int> {
            // "AA334" → [A, 3, 4]
            val arr = str.toSet() // str.toCharArray().distinct()
            // [2, 2, 1]
            val charCounts = arr.map { char -> str.count { it == char } }

            // {A=2, 3=2, 4=1}
            return arr.zip(charCounts).toMap()
        }

        // {A=2, 3=2, 4=1} → [2, 2, 1] → "122"
        private fun cardPattern(countUniq: Map<Char, Int>): String {
            return countUniq.values.sorted().joinToString(separator = "")
        }
        
        // "AA334" → "122"
        private fun cardPattern(str: String): String {
            // "AA334" → {A=2, 3=2, 4=1}
            val countUniq = countUniqueChars(str)
            // {A=2, 3=2, 4=1} → [2, 2, 1] → "122"
            return cardPattern(countUniq)
        }

        private fun fromPattern(pattern: String): HandType = entries.find { it.pattern == pattern } ?: UNKNOWN
        
        fun fromCards(cards: String): HandType? {
            val pattern = cardPattern(cards)
            return fromPattern(pattern)
        }

        // With Joker (wildcard) HandType are to be re-mapped differently:
        // HIGH_CARD("11111") → ONE_PAIR
        // ONE_PAIR("1112") → THREE_OF_A_KIND
        // TWO_PAIRS("122", 1×J) → FULL_HOUSE
        // TWO_PAIRS("122", 2×J) → FOUR_OF_A_KIND
        // THREE_OF_A_KIND("113") → FOUR_OF_A_KIND
        // FULL_HOUSE("23") → FIVE_OF_A_KIND
        // FOUR_OF_A_KIND("14") → FIVE_OF_A_KIND
        // FIVE_OF_A_KIND("5") → FIVE_OF_A_KIND
        fun fromWildCards(cards: String): HandType {
            val countUniq = countUniqueChars(cards)
            val pattern = cardPattern(countUniq)
            val countWildcards: Int? = countUniq.get(WILDCARD)

            if (countWildcards == null) {
                return fromPattern(pattern)
            }
            
            return when (pattern) {
                "11111" -> ONE_PAIR
                "1112" -> THREE_OF_A_KIND
                "122" -> if (countWildcards == 1) FULL_HOUSE else FOUR_OF_A_KIND
                "113" -> FOUR_OF_A_KIND
                "23", "14", "5" -> FIVE_OF_A_KIND
                else -> UNKNOWN
            }
        }
    }
}


val cardComparator = object : Comparator<String> {
    override fun compare(a: String, b: String): Int {      
        val len = min(a.length, b.length) - 1
        for (i in 0..len) {
            // try {
                val ai = CARDS_PATTERN.indexOf(a.get(i))
                val bi = CARDS_PATTERN.indexOf(b.get(i))
                if (ai != bi) return bi - ai
            // } catch (e: java.lang.StringIndexOutOfBoundsException) {
            //     return 0
            // }
        }
        return 0
    }
}

val wildcardComparator = object : Comparator<String> {
    override fun compare(a: String, b: String): Int {      
        val len = min(a.length, b.length) - 1
        for (i in 0..len) {
            val ai = CARDS_PATTERN_WILD.indexOf(a.get(i))
            val bi = CARDS_PATTERN_WILD.indexOf(b.get(i))
            if (ai != bi) return bi - ai
        }
        return 0
    }
}


val wildcardRankingComparator = object : Comparator<Hand> {
    override fun compare(a: Hand, b: Hand): Int = when {
        a.typeWild != b.typeWild -> b.typeWild.ordinal - a.typeWild.ordinal
		else -> wildcardComparator.compare(a.cards, b.cards)
	}
}


data class Hand(val cards: String = "", val bid: Int = 0) : Comparable<Hand> {
    init {
        require (Hand.regexCards.matches(cards)) {
            "Invalid input: " + cards
        }
        require (bid > 0) {
            "Invalid input: bid value should be > 0, provided bid = " + bid.toString()
        }
    }

    val sortedCards: String = cards.toCharArray().sortedBy{ CARDS_PATTERN.indexOf(it) }.joinToString("")

    private var _type: HandType? = null
    val type get(): HandType {
        if (_type == null) {
            _type = HandType.fromCards(cards)
        }
        return _type ?: throw AssertionError("Mangled internal property _type")
    }

    private var _typeWild: HandType? = null
    val typeWild get(): HandType {
        if (_typeWild == null) {
            _typeWild = HandType.fromWildCards(cards)
        }
        return _typeWild ?: throw AssertionError("Mangled internal property _typeWild")
    }


    companion object {
        @JvmField val regexCards = Regex("[%s]{5}".format(CARDS_PATTERN))

        // Factory
        fun create(raw: String): Hand {
            val (strCards, strBid) = raw.split(" ")
            return Hand(strCards, strBid.toInt())
        }
    }

    override fun toString() = "%s |%s| (%s / %s), bid %d".format(
        cards,
        sortedCards,
        type,
        typeWild,
        bid
    )

    override fun compareTo(other: Hand): Int = when {
        type != other.type -> other.type.ordinal - type.ordinal
		else -> cardComparator.compare(cards, other.cards)
	}
}


/**
 * Reads lines from the given input txt file.
 */
fun readInput(path: String): List<String> = Path("$path").readLines()


fun main() {
    val lines = readInput(INPUT_FILE_PATH)

    val hands = lines.filter { it.trim().length > 0 }
                    .map { Hand.create(it) }
                    .sorted()

    var total = 0
    hands.forEachIndexed{ rank, hand -> 
        total += (rank+1) * hand.bid
        // println(hand)
    }
    println("Part1: %d".format(total))

    var totalWildcard = 0
    hands.sortedWith(wildcardRankingComparator).forEachIndexed{ rank, hand -> 
        totalWildcard += (rank+1) * hand.bid
        // println(hand)
    }
    println("Part2: %d".format(totalWildcard))
}