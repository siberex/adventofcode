import scala.io.Source
import scala.util.matching.Regex
import java.io.{FileNotFoundException, IOException}

// val inputFilename = "2023/day5/input.sample.txt"
val inputFilename = "2023/day5/input.txt"

/*
type Mapping = {
    val src: Long
    val dest: Long
    val len: Long
}
*/
class Mapping(val src: Long, val dest: Long, val len: Long):
    
    def doMapping(x: Long): Option[Long] =
        if x >= src && x <= src + len - 1 then 
            Some(dest + (x - src)) 
        else
            None
    
    override def toString: String = s"$src → $dest ($len)"

object Mapping:
    def apply(list: List[Long]): Mapping = new Mapping(list(1), list(0), list(2))
end Mapping

/*
type MapGroup = {
    val name: String
    val maps: List[Mapping]
}
*/
class MapGroup(val name: String, val maps: List[Mapping]):

    def doMapping(mapFrom: Long): Long =
        val mappingRes = maps.to(LazyList).map(
                m => m.doMapping(mapFrom)
            ).collectFirst {
                case Some(d) => d 
            }
        // Any source numbers that aren't mapped correspond to the same destination number
        return mappingRes match {
            case Some(mapTo) => mapTo
            case _ => mapFrom
        }

    override def toString: String =
        val printedMaps = maps.fold("")((prev, next) => s"$prev\n$next")
        s"$name:$printedMaps"

object MapGroup:
    def apply(name: String, maps: List[List[Long]]): MapGroup =
        new MapGroup(
            name,
            maps.map(l => Mapping(l))
        )
end MapGroup

/**
    Traverse all maps and get the final mapping for initial seed
 */
def getMappping(seed: Long, mapGroups: List[MapGroup]): Long =
    var mapping = seed

    mapGroups.foreach(mapgroup => {
        val mapTo = mapgroup.doMapping(mapping)

        // val res = mapgroup.maps.flatMap(m => m.doMapping(mapFrom))
        // println(mapgroup.name)
        // println(s"$mapping → $mapTo")
        
        mapping = mapTo
    })

    return mapping


/*
seeds: 79 14 55 13
*/
val reSeeds: Regex = raw"seeds: ((?:\d+ ?)+[\n]?)".r

/*
soil-mapTo-fertilizer map:
0 15 37
37 52 2
39 0 15
*/
val reMappings: Regex = raw"([a-z-]+) map:\n((?:\d+ ?[\n]?)+)+".r

// Helper to convert "37 52 2" to (37, 52, 72)
val toLongList = (str: String) => str.split(' ').map(_.trim).map(_.toLong).toList

def parseMappings(name: String, rawValue: String): MapGroup =
    // rawValue = "0 15 37\n37 52 2\n39 0 15"
    // mappingsList = ( (0,15,37), (37,52,2), (39,0,15) )
    val mappingsList = rawValue.split("\n").map(_.trim).toList.map(toLongList)
    return MapGroup(name, mappingsList)

// Main
def parseInput(input: String): Unit =
    val seedsMatched = for (m <- reSeeds.findFirstMatchIn(input)) yield m.group(1)
    val seeds: List[Long] = toLongList(seedsMatched.getOrElse(""))

    val mappingsMatches = for (m <- reMappings.findAllMatchIn(input)) yield (m.group(1), m.group(2))
    val mapGroups = mappingsMatches.map(parseMappings).toList

    val seedMappings = seeds.map(
        seed => getMappping(seed, mapGroups)
    )

    // println(seeds)
    // println(seedMappings)

    val result = seedMappings.min 
    println(result)

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
