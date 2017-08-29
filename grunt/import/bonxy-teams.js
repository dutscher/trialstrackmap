var db = {
    "prio": [],
    "teams": {
        "1": {"name": "Vagrant Camps"},
        "2": {"name": "Cracked Plateaus"},
        "3": {"name": "Lazy Catapults"},
        "4": {"name": "Ice Blockades"},
        "5": {"name": "Market Streets"},
        "6": {"name": "Pipeline Camps"},
        "7": {"name": "Snowball Rides"},
        "8": {"name": "Cave Dwellers"},
        "9": {"name": "Abandoned Mines"},
        "10": {"name": "Muddy Mounds"},
        "11": {"name": "The Tanktops"},
        "12": {"name": "The Aqueducts"},
        "13": {"name": "Squall Slides"},
        "14": {"name": "Dust Bowls"},
        "15": {"name": "The Stacks"},
        "16": {"name": "The Watchers"},
        "17": {"name": "The Mills"},
        "18": {"name": "Pumpkin Deserts"},
        "19": {"name": "Choking Hazards"},
        "20": {"name": "Bunnyhops"},
        "21": {"name": "Wrecked Tracks"},
        "22": {"name": "The Quagmires"},
        "23": {"name": "Trojan Giraffes"},
        "24": {"name": "Burning Bushes"},
        "25": {"name": "Mud Cakes"},
        "26": {"name": "Widowmakers"},
        "27": {"name": "Fest Mines"},
        "28": {"name": "The Arches"},
        "29": {"name": "Great Walls"},
        "30": {"name": "Pain Marsh"},
        "31": {"name": "Barren Steps"},
        "32": {"name": "Dark Machines"},
        "33": {"name": "Tree Houses"},
        "34": {"name": "Villainous Hideouts"},
        "35": {"name": "Troll Lairs"},
        "36": {"name": "Frost Carnivals"},
        "37": {"name": "Smelting Pots"},
        "38": {"name": "Madhouse"},
        "39": {"name": "Steeple Runs"},
        "40": {"name": "Open Jaw Bogs"},
        "41": {"name": "Buzzsaw Paradise"},
        "42": {"name": "Lost Descents"},
        "43": {"name": "Flower Hills"},
        "44": {"name": "Rock Walls"},
        "45": {"name": "The Waterwheels"},
        "46": {"name": "Spider Kingdoms"},
        "47": {"name": "The Purifiers"},
        "48": {"name": "Garbage Routes"},
        "49": {"name": "Coaster Canyons"},
        "50": {"name": "Desert Gondolas"},
        "51": {"name": "The Naughty Lists"},
        "52": {"name": "The Pendulums"},
        "53": {"name": "Razor Dunes"},
        "54": {"name": "Devil Hoppers"},
        "55": {"name": "Flooded Highways"},
        "56": {"name": "Risky Rooftops"},
        "57": {"name": "Chilled Cliffs"},
        "58": {"name": "Dark Sands"},
        "59": {"name": "The Big Swings"},
        "60": {"name": "Doom Drops"},
        "61": {"name": "Leaping Hollows"},
        "62": {"name": "The Shafts"},
        "63": {"name": "Terror Towers"}
    }
}, rename = {
    "Coaster Canyon": "Coaster Canyons",
    "Treehouses": "Tree Houses",
    "Villianous Hideouts": "Villainous Hideouts"
}, newPrio = [];

function getTeamId (teamName) {
    var teamId = 0;
    for (var teamId_ in db.teams) {
        var team = db.teams[teamId_];
        if (teamName === team.name) {
            teamId = teamId_;
        }
    }
    return parseInt(teamId);
}

$(".sortable tr").each(function (i, tr) {
    if (i === 0)
        return;

    var $teamNameTD = $($(tr).find("td").get(1)),
        teamName = $teamNameTD.text(),
        teamId = 0;
    if (teamName in rename) {
        teamName = rename[teamName];
    }
    teamId = getTeamId(teamName);

    newPrio.push(teamId);
});
// add newest prio
db.prio.unshift(newPrio);
// log out
console.log(JSON.stringify(db.prio));