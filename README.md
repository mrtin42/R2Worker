# R2Worker
Simple Cloudflare Worker wrapper for your R2 bucket.

are you sick and tired of having to figure out amazon's needlessly complicated S3 API to interact with your Cloudflare R2 bucket? need a simple way to programatically interact with your R2 bucket but cant use their (somehow actually simpler) node.js SDK? well, look no further! R2Worker is a simple Cloudflare Worker that acts as a wrapper for your R2 bucket, allowing you to interact with it using simple HTTP requests and self defined authentication tokens. also eliminates the need for amazons resources because they're a terrible company and i hate them.

the acknowledgements section is at the bottom of the readme and its really long (lik my- nevermind) so ignore it if you want to but i think its funny so you should read it

## Configuration
1. fork the repo and clone it to your local machine (or just clone it if you're not planning on making any changes, but you wont be able to push changes to your wrangler.toml if you do that)
2. run `npm install` to install the dependencies (wrangler only tbh LOL)
3. run `npx wrangler login` to connect your Cloudflare account to wrangler
4. configure your wrangler.toml with the bucket you want to use (see below)
```toml

[[r2_buckets]]
name = "MY_BUCKET" # if you change this name, you'll also need to change the bucket name in the Env type in src/index.ts (see below)
bucket = "my-bucket" # your bucket name - case sensitive (i think??)
```

```ts
// src/index.ts

type Env = {
  MY_BUCKET: string; // this should match the name in the toml file
  AUTH_TOKEN: string; // your R2 auth token - stored as a secret via wrangler (or .dev.vars when testing locally)
};
```
5. run `npm run deploy` to deploy the worker to your Cloudflare account
6. connect two domain routes to your worker - one for the workers upload route and one for the workers download route (upload.img.customdomain.com and img.customdomain.com, for example)

## Usage
the path you want to make the request to is the same as the path in your bucket. for example, if you have a file in your bucket at `my-bucket/my-file.txt`, you would make a request to `https://<worker>.<account>.workers.dev/my-file.txt` or `https://img.customdomain.com/my-file.txt`

supports GET and HEAD for retrieving files, POST and PUT for uploading files, and DELETE for deleting files

an authorization token is required for all upload requests - this is defined in your cloudflare account as a secret (or in your .dev.vars file when testing locally) - no token is required for retrieving files because that would be stupid

## Responses
### Retrieving files
- `200 OK` - the file was found and the contents are in the response body
- `404 Not Found` - the file was not found - the response body will be empty
- `500 Internal Server Error` - something went wrong on the worker's end - the response body will be empty (or a Cloudflare error page, who knows)
- `418 I'm a teapot` - this literally does not happen, but if it does, you should probably stop using this worker and call the police because something has gone horribly wrong (i'm kidding it never happens at all (yet. tee hee!))

### Uploading files
- `200 OK` - the file was uploaded successfully - the response body be JSON with the following structure:
```json
{
  "status": "success",
  "message": "file uploaded successfully",
  "url": "https://img.customdomain.com/my-file.txt" // the worker's default workers.dev domain also works here, but the response will always use the custom domain
}
```
- `400 Bad Request` - the request did not include a file to upload - the response body will be sarcastic and tell you to include one hes really mean like that i cried
- `500 Internal Server Error` - something went wrong on the worker's end - the response body will probably be empty (or a Cloudflare error page, who knows)
- `401 Unauthorized` - the request did not include an authorization token - the response body will shout at you for not including one

## Acknowledgements
- [Cloudflare](https://cloudflare.com) for their amazing developer platform (and for making a neat example for me to base this off of)
- my mom for always believing in me
- my dad for also always believing in me (and chipping in for the workers bill)
- my friends for always being there for me (and somehow not getting tired of me talking about this stuff all the time)
- you for reading this far
- angel dust for being frankly the best character in hazbin hotel, like, ever also hes hot i have the fattest crush on him oh my god
- the 2010 Chilean Earthquake for not killing me when it had the chance (i was in the country when it happened and it was scary as fuuuckkkk) (actually i was 2 i dont remember diddly squat but it was still scary)
- the Transport for London network for being goated (except the central line you suck you stink and you're louder than my mum when she's mad at me like jesus christ WD-40 exists for a reason) and for not killing me when it had the chance (they tell you to stand behind the yellow line for a reason kids - i learned that *the hard way*.) (this time i was 15 and i remember it like it was yesterday im so glad no trains were coming quite yet otherwise R2Worker wouldnt exist)
- angel dust *again* because i love him so much oh my god
- vivziepop for creating cool shows about hell and stuff and for making angel dust so hot oh my god i love him so much someone needs to stop me im going to bug out
- dantdm, markiplier, and jacksepticeye for being the only youtubers i can stand to watch for more than 5 minutes at a time
- bernie sanders for once again asking for my financial support (HELL NAW!)
- the conservative party for giving everyone a reason to hate them YOU SUCK BALLS LITERALLY EVERYONE HATES YOU GET OUT OF MY COUNTRY (gosh i sound like them saying that)
- the labour party for being almost just as bad for goodness sake can keir starmer just get a personality already i actually hate this government so much
- angel dust *again* ***again*** because gay awakening :sob emoji: (actualy it was a bi awakening but i umbrella term becuase english is a stupid language)
- my water bottle for always being there for me when i need a drink (i love you so much babycakes)
- the coronavirus lockdown for ruining my brain by forcing me to stay on the internet all day every day (i have made irreversible mistakes because of you)
- those surgeons back when i was in year 2 for saving my life when i had appendicitis (first surgery i ever had that shit was scary as fuck)
- ryanair for somehow literally having the worst reputation but never once giving me a bad experience i love you guys so much
- the coronavirus lockdown again for ending (i almost became chronically online because of you i mightve become a furry thank GOODNESS that didnt happen i cannot STAND furries)
- amazon for making a needlessly complicated API for S3, prompting me to make this worker so that R2 could be used more easily (seriously wtf dude)
- angel dust *again* ***again*** ***AGAIN*** because i cannot stress enough how much i love him oh my god
- you again for reading this far again like seriously how much have i written this is basically an autobiography at this point
- me for writing this whole thing in one sitting and not giving up halfway through (i have a tendency to do that)
- and last but not least, FREE PALESTINE (hey benjamin netanyahu can you please ROPEMAXX yourself? thanks) - do your daily click: https://arab.org/ (the war is a serious issue and i'm not making light of it, but i'm also not going to let it go unnoticed in my readme file - i'm not a politician, i'm a programmer, but i'm also a human being and i have a heart unlike that twatstain benjamin netanyahu oh brother this guy stinks!!!!!!!!!!!!!!!!)

***

R2Worker - a [MartinDEV](https://www.martin.blue) project (one day i'll have *martindev.com*. one day.)
