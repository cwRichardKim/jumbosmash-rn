const images = [
  {large: "https://imgur.com/djAVBYh.jpg", small: "https://imgur.com/zZLekkc.jpg"},
  {large: "https://imgur.com/B1R6217.jpg", small: "https://imgur.com/4vvKTqh.jpg"},
  {large: "https://imgur.com/3uPaRkD.jpg", small: "https://imgur.com/vP3BRfx.jpg"},
  {large: "https://imgur.com/CcNAlm2.jpg", small: "https://imgur.com/r4JBflj.jpg"},
  {large: "https://imgur.com/ZYzCUBO.jpg", small: "https://imgur.com/C0PpdB6.jpg"},
  {large: "https://imgur.com/SsD8L6P.jpg", small: "https://imgur.com/7kioNXs.jpg"},
  {large: "https://imgur.com/GQmIes5.jpg", small: "https://imgur.com/mmlAmri.jpg"},
  {large: "https://imgur.com/l9M5GCs.jpg", small: "https://imgur.com/ZM9btFh.jpg"},
  {large: "https://imgur.com/B0OIgDl.jpg", small: "https://imgur.com/henSeOU.jpg"},
]

module.exports = {
  myProfile: {
    id: "1",
    firstName: "Jumbo",
    lastName: "Smusher",
    email: "jumbo@tufts.edu",
    description: "TWENTY SEVENTEEEEEEEN",
    tags: ['indian', 'vegetarian', 'fancy food', 'breakfast', 'spicy', 'fast food', 'raki', 'natty light', 'tequila', 'whisky', 'cognac', 'gin', 'scotch', 'agua ardiente', 'hodgedon', 'NYC-bound', '4.0', 'open relationship', 'single', 'photography', 'netflix', '420', 'taking selfies', 'dancing', 'stripping', 'pop', 'EDM', 'dubstep', 'hard rock', 'jazz', 'anything but country and metal', 'fuck the pats'],
    major: "Rocket Scientist",
    photos: [
      {large: "https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg"},
      {large: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg"},
      {large: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg"},
    ]
  },
  profiles: [
    {
      id: "2",
      firstName: "Richard",
      lastName: "Kim",
      email:"Richard.Kim@tufts.edu",
      description: "Jumbosmash Developer / PM / Hermit. 'Heads up, I'm probably going to break the server'.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Computer Science & Cognitive Brain Sciences",
      tags: ["korean","🌯","🍝","🍕","🍣","wine","soju","carm","hodgedon","double major","SF-bound","in a relationship","dead inside","420","hiking","soul","anything but country and metal","colbert"],
      teamMember: true,
      photos: [
        {large: "https://imgur.com/mWf5Rqc.jpg", small: "https://imgur.com/qRQ7pvx.jpg"},
        {large: "https://imgur.com/vbCbjuS.jpg", small: "https://imgur.com/izs4HtZ.jpg"},
        {large: "https://imgur.com/lMUismz.jpg", small: "https://imgur.com/6WaKd2f.jpg"},
      ]
    },
    {
      id: "3",
      firstName: "Elif",
      lastName: "Kinli",
      email:"Elif.Kinli@tufts.edu",
      description: "Jumbosmash Developer / Backend Magician. 'OMG stop breaking the server'.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Computer Science",
      tags: ['kosher', 'beer',"🍑", "🍦", "🌯", 'baijiu', 'all alcohol', 'agua ardiente', 'dewick', 'hodgedon', 'metal', 'heavy metal', 'kimmel'],
      teamMember: true,
      photos: [
        {large: "https://imgur.com/FNE3gsT.jpg", small: "https://imgur.com/45BxuuN.jpg"},
        {large: "https://imgur.com/0oN06A2.jpg", small: "https://imgur.com/0t7LDnq.jpg"},
        {large: "https://imgur.com/FmgneKM.jpg", small: "https://imgur.com/NeUck6R.jpg"},
      ]
    },
    {
      id: "4",
      firstName: "Jade",
      lastName: "Chan",
      email:"Jade.Chan@tufts.edu",
      description: "Jumbosmash Developer / Auth Wrangler. 'ugh react native why won't you BUILD'.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Computer Science",
      tags: ['fast food', 'seafood', "🍜", "🍝", "🍕", 'brunch', 'fireball', 'cocktails', 'president of a club', 'traveling', 'singing', 'rap', 'blues', 'letterman'],
      teamMember: true,
      photos: [
        {large: "https://imgur.com/7eYec2z.jpg", small: "https://http://imgur.com/nwZZV2F.jpg"},
        {large: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg"},
        {large: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg"},
      ]
    },
    {
      id: "5",
      firstName: "Jared",
      lastName: "Moskowitz",
      email:"Jared.Moskowitz@tufts.edu",
      description: "Jumbosmash Developer / Comedic Designer. 'Just so everyone is aware, I'm the comedic designer now'.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Computer Science & Physics",
      teamMember: true,
      tags: ['fast food', 'gin',"🍣", "🍔", "🥗", 'carm', 'SF-bound', '4.0', 'single', 'netflix', 'jazz', 'go pats', 'team jacob', 'team star trek', 'fallon', 'ferguson'],
      photos: [
        {large: "https://imgur.com/BWxS7tz.jpg", small: "https://imgur.com/scB6o38.jpg"},
      ]
    },
    {
      id: "6",
      firstName: "Shanshan",
      lastName: "Duan",
      email:"Shanshan.Duan@tufts.edu",
      description: "Jumbosmash Designer. '#6D69CC is my shit'.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Engineering Psychology",
      teamMember: true,
      tags: ["🍗", "🌭", "🍫", "🍩",'fast food', 'president of a club', 'DC-bound', 'Seattle-bound', 'netflix'],
      photos: [
        {large: "https://imgur.com/g84yh3e.jpg", small: "https://imgur.com/SZXgYlg.jpg"},
        {large: "https://imgur.com/f8M8pp8.jpg", small: "https://imgur.com/g9XOecs.jpg"},
      ]
    },
    {
      id: "7",
      firstName: "Bruno",
      lastName: "Olmedo",
      email:"Bruno.Olmedo@tufts.edu",
      description: "Jumbosmash Designer / emojifier, Bruno 'daddy' Olmedo.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Engineering Psychology",
      tags: ["🍫", "🍩", "🍆", "🍑", "🍦", 'frozen yogurt', 'raki', 'rum', 'all alcohol', 'famous memer', 'bedpost-bound', 'did porn to pay for tuition', 'traveling', 'taking selfies', 'rap', 'hip hop', 'feet'],
      teamMember: true,
      photos: [
        {large: "https://imgur.com/jNNkPTV.jpg", small: "https://imgur.com/pUpqN8E.jpg"},
        {large: "https://imgur.com/R4awa3I.jpg", small: "https://imgur.com/LXchotw.jpg"},
        {large: "https://imgur.com/PenF6JC.jpg", small: "https://imgur.com/AUj0Xlo.jpg"},
      ]
    },
    {
      id: "8",
      firstName: "Justin",
      lastName: "Sullivan",
      email:"Justin.Sullivan@tufts.edu",
      description: "Jumbosmash Web Developer. 'Just watch, this shit is going to be so pretty'.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Computer Science",
      tags: ["🍑", "🍦", "🌯", "🍜",'IPAs', 'fireball', 'in a relationship', 'team prequels were not that bad'],
      teamMember: true,
      photos: [
        {large: "https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/109914/screenshots/905742/elephant_love.jpg"},
        {large: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/1095591/screenshots/2711715/polywood_01_elephant_01_dribbble.jpg"},
        {large: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg", small: "https://d13yacurqjgara.cloudfront.net/users/179241/screenshots/2633954/chris-fernandez-elephant-2.jpg"},
      ]
    },
    {
      id: "9",
      firstName: "Gray",
      lastName: "Woods",
      email:"gray.woods@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "International Relations",
      tags: ['thai', 'frozen yogurt', 'jobless af', 'Seattle-bound', 'single', 'so fucking single omg', 'one night stands', '420', 'team edward', 'colbert', 'virgin', 'filmed', 'watersports', 'hallibang'],
      photos: [images[1], images[2], images[3]]
    },
    {
      id: "10",
      firstName: "Morgan",
      lastName: "Akpofure",
      email:"morgan.akpofure@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Economics",
      tags: ['indian', 'sandwiches', 'spicy', 'brunch', 'vodka', 'fireball', 'NYC-bound', 'team star wars', 'colbert', 'bdsm (heavy)', 'tisch bang'],
      photos: [images[2], images[3], images[4]]
    },
    {
      id: "11",
      firstName: "Kennedy",
      lastName: "Bellandi",
      email:"kennedy.bellandi@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Math",
      tags: ['kosher', 'fancy food', 'spicy', 'IPAs', 'brandy', 'agua ardiente', 'acapella', 'Boston-bound', 'Chicago-bound', 'greek', 'swimming', 'netflix', 'hip hop', 'blues', 'anything but country and metal', 'team edward', 'fallon', '3some'],
      photos: [images[3], images[4], images[5]]
    },
    {
      id: "12",
      firstName: "Ronnie",
      lastName: "Caron",
      email:"ronnie.caron@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Philosophy",
      tags: ['4.0', '420', 'fb stalking', 'rock', 'classical', 'jazz', 'punk', 'team star trek', "devil's 3some", 'butt stuff', 'in public'],
      photos: [images[4], images[5], images[6]]
    },
    {
      id: "13",
      firstName: "Lacy",
      lastName: "Bellamy",
      email:"lacy.bellamy@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "English",
      tags: ['indian', 'breakfast', 'steak', 'cuddles', 'strictly platonic', 'taking selfies', 'EDM', 'team edward', 'orgy', 'leather'],
      photos: [images[5], images[6], images[7]]
    },
    {
      id: "14",
      firstName: "Ling",
      lastName: "Garland",
      email:"ling.garland@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Psychology",
      tags: ['beer', 'hodgedon', 'cuddles', 'photography', 'dubstep', 'blues', 'kimmel', 'bdsm (light)', 'thirsty af'],
      photos: [images[6], images[7], images[8]]
    },
    {
      id: "15",
      firstName: "FakeName",
      lastName: "Lesley",
      email:"RealName.LastName@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Chemistry",
      tags: ['korean', 'fancy food', 'fast food', 'brunch', 'tequila', 'all alcohol', 'agua ardiente', 'acapella', 'strictly platonic', 'netflix', 'masturbation', 'dubstep', 'ferguson', 'butt stuff', 'spanking'],
      photos: [images[7], images[8], images[0]]
    },
    {
      id: "16",
      firstName: "NickName",
      lastName: "LastName",
      email:"RealName.asdf@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "International Relations",
      tags: ['spicy', 'scotch', 'carm', 'NYC-bound', 'strictly platonic', 'indie', 'hard rock', 'jazz', 'punk', '3some', 'thirsty af'],
      photos: [images[1], images[2], images[3]]
    },
    {
      id: "17",
      firstName: "Chandra",
      lastName: "Webster",
      email:"Chandra.Webster@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Economics",
      tags: ['fast food', 'IPAs', 'rum', 'vodka', 'double major', 'SF-bound', 'masturbation', 'soul', 'raw'],
      photos: [images[2], images[3], images[4]]
    },
    {
      id: "18",
      firstName: "Xia",
      lastName: "Baumhauer",
      email:"Xia.Baumhauer@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Math",
      tags: ['breakfast', 'steak', 'spicy', 'frozen yogurt', 'raki', 'IPAs', 'NYC-bound', 'complicated', 'single af', 'strictly platonic', 'classical', 'punk', 'go pats', 'bdsm (light)', 'in public', 'tisch bang'],
      photos: [images[3], images[4], images[5]]
    },
    {
      id: "19",
      firstName: "Lhamo",
      lastName: "Henny",
      email:"Lhamo.Henny@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Philosophy",
      tags: ['vegetarian', 'thai', 'sandwiches', '4.0', 'one night stands', 'netflix', 'traveling', 'masturbation', 'heavy metal', 'rock', 'fuck the pats', "devil's 3some", 'feet'],
      photos: [images[4], images[5], images[6]]
    },
    {
      id: "20",
      firstName: "Chanda",
      lastName: "Dalen",
      email:"Chanda.Dalen@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "English",
      tags: ['natty light', 'IPAs', 'wine', 'cuddles', 'clubbing', 'puppeteering', 'EDM', 'soul', 'conan', 'tisch bang'],
      photos: [images[5], images[6], images[7]]
    },
    {
      id: "21",
      firstName: "FakeNews",
      lastName: "Lies",
      email:"RealNews.hey@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Psychology",
      tags: ['korean', 'seafood', 'idc stuff my face', 'brunch', 'natty light', 'whisky', 'sake', 'fireball', 'double major', '4.0', 'married', 'dead inside', 'hiking', 'heavy metal', 'hard rock', 'alternative', 'fuck the pats', 'team jacob', 'leather', 'tisch bang'],
      photos: [images[6], images[7], images[8]]
    },
    {
      id: "22",
      firstName: "Vijaya",
      lastName: "Bennet",
      email:"Vijaya.Bennet@tufts.edu",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tincidunt arcu, in accumsan erat. Etiam ullamcorper enim tincidunt dui faucibus posuere. Pellentesque in ante nisi. Duis pharetra arcu in scelerisque posuere. Quisque nisl odio, molestie vitae interdum id, pulvinar vitae orci. Donec vitae molestie nisl. Etiam odio nunc, tincidunt quis nunc vel, consequat finibus enim. Integer dapibus interdum dui vestibulum finibus. Phasellus suscipit dui nec lorem pretium congue.",
      major: "Chemistry",
      tags: ['vegetarian', 'breakfast', 'clubbing', 'soul', 'fuck the pats', 'spanking'],
      photos: [images[7], images[8], images[0]]
    }
  ]
}
