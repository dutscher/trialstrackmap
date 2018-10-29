/*
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/playerstats/v1/ranking/track1155?range=1,100
https://lb-rdv-http.ubi.com/TRIAG_IP_LNCH_A/public/playerstats/v1/ranking/track1155?range=1,100
https://public-ubiservices.ubi.com/v1/profiles?profileId=%s

%server%/public/pvp_matches/v1/player/%s
%server%/public/playerprogress/v1/progress/status?profileid=%s
*/
module.exports = {
    "averages": {
        "nuthin-but-a-tfg-thang": 21706,
        "vanilla-ice-blockade": 21233,
        "welcome-to-the-urban-jungle": 23059,
        "wu-tango-clan": 0,
        "cypress-hill-climb": 184554,
        "metallica-mayhem": 20399,
        "rage-against-the-dark-machine": 22174,
        "notorious-tfg": 21416,
    },
    // database/media/bikes.json .bikes -> bikeId
    // build/import/game/XXX/levels.json5 -> trackId
    // database/trackdata/ids.json -> oid === trackId
    "week": [
        {
            "id": 10,
            "bike": "KTM Rally",
            "bikeId": 14,
            "trackName": "Bouncy Hills",
            "trackId": 1056,
        },
        {
            "id": 9,
            "bike": "Mantis",
            "bikeId": 5,
            "trackName": "Cannon End",
            "trackId": 1108,
            "results": {
                "map": "https://i.imgur.com/cIZYAix.jpg",
                "table": "https://i.imgur.com/FwS7GF6.png",
                "overview": "https://i.imgur.com/DYXSB9y.jpg",
            }
        },
        {
            "id": 8,
            "trackName": "Mt. Whiplash",
            "trackId": 1376,
            "withoutImprove": true,
            "withoutBikeId": true,
            "results": {
                "map": "https://i.imgur.com/zLxtl4B.jpg",
                "table": "https://i.imgur.com/trWIHIZ.jpg",
                "overview": "https://i.imgur.com/8uM4ohY.jpg",
            }
        },
        {
            "id": 7,
            "bike": "Tango",
            "bikeId": 2,
            "trackName": "Backyard Catwalk",
            "trackId": 1116,
            "results": {
                "map": "https://i.imgur.com/2kEhczM.jpg",
                "table": "https://i.imgur.com/MDfo314.jpg",
                "overview": "https://i.imgur.com/UevHbPR.jpg",
            }
        },
        {
            "id": 6,
            "bike": "KTM Rally",
            "bikeId": 14,
            "trackName": "Terror Tower",
            "trackId": 1204,
            "results": {
                "map": "https://i.imgur.com/Zc6NSVJ.jpg",
                "table": "https://i.imgur.com/6ieS3KG.png",
                "overview": "https://i.imgur.com/1mnI6yZ.jpg",
            }
        },
        {
            "id": 5,
            "bike": "KTM Rally",
            "bikeId": 14,
            "trackName": "The Bell Pit",
            "trackId": 1253,
            "results": {
                "map": "https://i.imgur.com/lcc3rIE.jpg",
                "table": "https://i.imgur.com/r9GhqsB.png",
                "overview": "https://i.imgur.com/h8RH9gv.jpg",
                "fastest": "https://i.imgur.com/jqC4Svv.png",
            }
        },
        {
            "id": 4,
            "bike": "Marauder",
            "bikeId": 6,
            "trackName": "Crystal Kingdom",
            "trackId": 1196,
            "results": {
                "map": "https://i.imgur.com/zdHv6vF.jpg",
                "table": "https://i.imgur.com/k2u2FVl.png",
                "overview": "https://i.imgur.com/bcxC58q.jpg",
                "fastest": "https://i.imgur.com/DaEDOjt.png",
            }
        },
        {
            "id": 3,
            "bike": "Berserker",
            "bikeId": 8,
            "trackName": "Scorched Battlement",
            "trackId": 1103,
            "results": {
                "map": "https://i.imgur.com/h57wxjn.jpg",
                "table": "https://i.imgur.com/5qmmIVQ.jpg",
                "overview": "https://i.imgur.com/GVCwBC3.jpg",
                "fastest": "https://i.imgur.com/o8C7lGF.png",
            }
        },
        {
            "id": 2,
            "bike": "Berserker",
            "bikeId": 8,
            "trackName": "Canary Street",
            "trackId": 1107,
            "results": {
                "map": "https://i.imgur.com/lNpTIxo.jpg",
                "table": "https://i.imgur.com/ONZJVsZ.jpg",
                "overview": "https://i.imgur.com/eU2v0TP.jpg",
                "fastest": "https://i.imgur.com/wWoSEFt.jpg",
            }
        },
        {
            "id": 1,
            "bike": "KTM 450 Rally",
            "bikeId": 14,
            "trackName": "Firefly Landing",
            "trackId": 1155,
            "results": {
                "map": "https://i.imgur.com/X1bPDvv.jpg",
                "table": "https://i.imgur.com/tSyWRKI.jpg",
                "overview": "https://i.imgur.com/8lTHjQK.jpg",
                "fastest": "https://i.imgur.com/O6nrWnU.png",
            }
        }
    ],
    "colors": {
        "red": [
            "nuthin-but-a-tfg-thang",
            "vanilla-ice-blockade",
            "welcome-to-the-urban-jungle",
            "wu-tango-clan",
        ],
        "blue": [
            "cypress-hill-climb",
            "metallica-mayhem",
            "rage-against-the-dark-machine",
            "notorious-tfg",
        ]
    },
    "platform": {
        "ios": 1,
        "android": 2,
    },
    "teams": {
        "vanilla-ice-blockade": [
            {
                "up": "Ghisone_T3F",
                "rl": "Ghislain",
                "id": "170af281-cf4e-426a-b16c-223a4757d326-2"
            },
            {
                "up": "RedDevil-TFG",
                "l": true,
                "rl": "Gaurav",
                "id": "1e360316-ccd0-4832-bb24-04a7f522b8a4-2"
            },
            {
                "up": "dutscher-DE",
                "rl": "Dutscher",
                "id": "c58587cb-75c5-4a13-a359-1a6b01a116d0-2"
            },
            {
                "up": "Davy-Jones-T3F",
                "rl": "Nicolas",
                "id": "c08e4e7f-25e5-42ef-8671-1b7859deca7b-2"
            },
            {
                "up": "IND-HARMAN-TFG",
                "rl": "Harman",
                "id": "22b4274a-b04b-41e9-b80c-97d9a439938d-1"
            },
            {
                "up": "Sl1mboy84_T3F",
                "rl": "Guillaume",
                "id": "ea50c2c5-bd3a-41e6-9d81-d7cd7572e29e-2"
            },
        ],
        "cypress-hill-climb": [
            {
                "up": "bertnernie-TFG",
                "l": true,
                "id": "5f95f312-384a-4035-9a3b-1b2e58f92c54-2"
            },
            {
                "up": "Nesox_",
                "id": "7fd96af2-ecff-4b4b-a359-9b0f24d93741-1"
            },
            {
                "up": "Nasferatu-TFG",
                "id": "798e5861-3f5b-4f37-88e4-4a7f2e9efc0b-2"
            },
            {
                "up": "Dozer84-TFG",
                "id": "6a872f7d-df7e-4d7e-b01a-ab2d63eb0eb7-2"
            },
            {
                "up": "NL-CasperH",
                "id": "b0c79c69-c70d-49fe-87bf-48a6d60a2ac3-1"
            },
            {
                "up": "AurisLT-TFG",
                "id": "209c0644-a80a-41a9-aff9-748b7268d84d-2"
            },
        ],
        "metallica-mayhem": [
            {
                "up": "WonkyJon-TFG",
                "id": "0b09dfe2-7bdb-46d4-bba4-fa908c0c406f-1"
            },
            {
                "up": "UK-BuRNZeE",
                "id": "5ddd6efe-3ae5-4c9c-8d80-8370522c1a54-1"
            },
            {
                "up": "TTT-nairdA-RON",
                "id": "ccf84f96-8359-41cf-9bc2-925da1108f13-2"
            },
            {
                "up": "Surf-tiki_TFG",
                "id": "a50a0a1b-5bd1-43fa-b1df-a1347c4cd35e-2"
            },
            {
                "up": "CZE-Barton-TFG",
                "l": true,
                "id": "1c4c87e0-6552-4c11-b62d-dd55794f56a0-1"
            },
            {
                "up": "CA-MtHfKaJoNeZ",
                "id": "18b2a6c5-4880-4324-ab9f-273baf92d9af-2"
            },
            {
                "up": "TFG_Killermega",
                "id": "c15cacb4-30fd-41bf-a6c1-23e540d51cbb-2"
            },
            {
                "up": "ClungeCake-TFG",
                "id": "88d30115-c082-4b7d-8bb6-fe02b00c6ee7-2"
            },
        ],
        "nuthin-but-a-tfg-thang": [
            {
                "up": "NO-Bwestlie",
                "id": "c0f41bbc-42f3-41ff-b97a-f70edee6d84d-2"
            },
            {
                "up": "PapaFrey",
                "l": true,
                "id": "77371eae-1e0e-4f83-9cfd-9636379da4ef-1"
            },
            {
                "up": "NL-WENER8-TFG",
                "id": "d5ee6907-5291-4f54-b371-b54448853c2f-2"
            },
            {
                "up": "Tichoslapek-TFG",
                "id": "0d88e374-1edb-4ffd-8955-85ff397fc3fb-2"
            },
            {
                "up": "VaNa91",
                "id": "af9b703c-148a-4467-8163-185df3cdc958-1"
            },
            {
                "up": "calinbasturea22",
                "id": "01a593c7-8b03-4afe-87b8-0ce9b1676c8b-1"
            },
        ],
        "rage-against-the-dark-machine": [
            {
                "up": "donkey-TFG",
                "id": "e67ca1ea-7d80-4b60-a376-b3a41f384de3-2"
            },
            {
                "up": "TesTosTrogN-TFG",
                "id": "4a2e8e11-9070-4f28-aa55-c57439a81f16-1"
            },
            {
                "up": "violntshags",
                "id": "444ab3e2-cdf9-40f5-8756-6778815aa5e7-1"
            },
            {
                "up": "CA-Cardinal-TTT",
                "id": "634af020-b0b2-4121-be8e-8cb86f093e02-1"
            },
            {
                "up": "farnsi_TFG",
                "id": "5f6f1c53-d37f-4518-824a-1df3ed5062fa-1"
            },
            {
                "up": "mashpotato-TFG",
                "l": true,
                "id": "fdeaa705-acf3-47ef-9e2d-a9bef229efc0-1"
            },
            {
                "up": "Engage_death",
                "id": "c9cf6205-8abc-4900-a23b-ed22488eda35-2"
            },
        ],
        "welcome-to-the-urban-jungle": [
            {
                "up": "Diogo.hTBR",
                "id": "d445974b-2a89-4c7b-a9d4-573f67724ada-2"
            },
            {
                "up": "USA-Mike_G-TFG",
                "id": "40f2a691-9ff2-4193-b04a-8311b2013dab-1"
            },
            {
                "up": "BaDBoY53-TFG",
                "id": "5a84be2b-fb04-417b-a5bd-37418f4122e5-1"
            },
            {
                "up": "Bubbelz89",
                "id": "152aaba6-e345-42a9-b90c-b6512df49c2a-1"
            },
            {
                "up": "Malr0g-TFG",
                "l": true,
                "id": "0c814b51-25af-4945-ba86-1e2ccb0b635c-2"
            },
            {
                "up": "Chemical-TBR",
                "id": "4c274e59-4159-4a19-96f5-1f81649fc28a-2"
            },
        ],
        "wu-tango-clan": [
            {
                "up": "suicyco-TFG",
                "l": true,
                "id": "3d5d029a-9f4b-4d2f-aa45-ddf1752d4fff-2"
            },
            {
                "up": "ACE135-TFG",
                "id": "bab4bb96-891b-474b-af5c-728d575408db-1"
            },
            {
                "up": "saados777",
                "id": "7ef0c491-b14f-419a-8d10-4ff63d85bcc6-1"
            },
            {
                "up": "Spetsnaz-TFG",
                "id": "089d693f-6e03-44cc-bc3c-e4fc67ca8626-1"
            },
            {
                "up": "US-Novastar-TTT",
                "id": "1859a565-7052-4c6e-9286-277d149e9e67-1"
            },
            {
                "up": "Akrasiia",
                "id": "6f4f5170-8e20-4ef1-8a93-2c424619a1e6-2"
            },
        ],
        "notorious-tfg": [
            {
                "up": "SweatyPalms-TFG",
                "id": "5f685e0b-8a2b-4912-82ab-53dabb17d60f-2"
            },
            {
                "up": "MartinUchiha",
                "l": true,
                "id": "e5df1acb-b6cf-411a-9726-eb6209a12e21-1"
            },
            {
                "up": "RF_WhiteShakers",
                "id": "0c3f5dfc-910c-447d-a6ee-3553bf354a2a-1"
            },
            {
                "up": "RU-DarkNex-TFG",
                "id": "1280d0fd-22b6-4841-8574-fa5dba6d8488-1"
            },
            {
                "up": "PH-kiandavila",
                "id": "adc2f82a-1977-453e-ac43-ad93e2d0ec57-2",
                "xid": "adc2f82a-1977-453e-ac43-ad93e2d0ec57-1"
            },
            {
                "up": "DarthKavera-TBR",
                "id": "15fd1a53-94c2-4efa-a094-e3b2b1cc56b4-2"
            },
        ]
    },
    "left": {
        "nuthin-but-a-tfg-thang": [
            {
                "up": "Abylons",
                "id": "07a54fd0-7d1a-40f0-b819-288ebbd46ecd-1"
            },
        ],
        "wu-tango-clan": [
            {
                "up": "BellaRose-TFG",
                "id": "6e559fcc-8f21-44ed-b301-be8e787c4774-2"
            },
        ]
    },
    "new": [
        {
            "up": "",
            "id": ""
        },
    ]
};