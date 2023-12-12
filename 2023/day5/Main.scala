import scala.io.Source
import scala.util.matching.Regex
import java.io.{FileNotFoundException, IOException}

val inputFilename = "2023/day5/input.sample.txt"
// val inputFilename = "2023/day5/input.txt"

/*
type Mapping = {
    val src: Long
    val dest: Long
    val len: Long
}
*/
class Mapping(val src: Long, val dest: Long, val len: Long):
    override def toString: String = s"$src → $dest ($len)"
object Mapping:
    def apply(list: List[Long]): Mapping = new Mapping(list(1), list(0), list(2))
end Mapping

/*
type Mappings = {
    val name: String
    val maps: List[Mapping]
}
*/
class Mappings(val name: String, val maps: List[Mapping]):
    override def toString: String =
        val printedMaps = maps.fold("")((prev, next) => s"$prev\n$next")
        s"$name:$printedMaps"
object Mappings:
    def apply(name: String, maps: List[List[Long]]): Mappings =
        new Mappings(
            name,
            maps.map(l => Mapping(l))
        )
end Mappings

/*
seeds: 79 14 55 13
*/
val reSeeds: Regex = raw"seeds: ((?:\d+ ?)+[\n]?)".r

/*
soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15
*/
val reMappings: Regex = raw"([a-z-]+) map:\n((?:\d+ ?[\n]?)+)+".r

val toIntList = (str: String) => str.split(' ').map(_.trim).map(_.toLong).toList

def parseInput(input: String): Unit =
    val seedsMatched = for (m <- reSeeds.findFirstMatchIn(input)) yield m.group(1)
    val seeds: List[Long] = toIntList(seedsMatched.getOrElse(""))
    println(seeds)

    val mappings = for (m <- reMappings.findAllMatchIn(input)) yield (m.group(1), m.group(2))
    mappings.foreach(parseMappings)

    return


def parseMappings(name: String, rawValue: String): Unit =

    // ( (0,15,37), (37,52,2), (39,0,15) )
    val mappingsList = rawValue.split("\n").map(_.trim).toList.map(toIntList)

    val mappings = Mappings(name, mappingsList)
    println(mappings)

    // for (m <- mappings.maps) {
        // m.src, m.dest ...
    // }

    return

@main def main: Unit =
    // val currentDirectory = new java.io.File(".").getCanonicalPath
    
    try
        val bufferedSource = Source.fromFile(inputFilename)
        val fileContents = bufferedSource.getLines().mkString("\n")
        bufferedSource.close()

        parseInput(fileContents)

    catch
        case e: FileNotFoundException => printf("Couldn't find file: %s\n", inputFilename)
        case e: IOException => println("Got an IOException!")

    return
