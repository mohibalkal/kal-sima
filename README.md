# kal-sima
[![kal-sima Image](.github/kal-sima.png)](https://docs.kal-sima.lol)  

**I *do not* endorse piracy of any kind I simply enjoy programming and large user counts.**

## Links And Resources
| Service        | Link                                                             | Source Code                                              |
|----------------|------------------------------------------------------------------|----------------------------------------------------------|
| kal-sima Docs | [sudo-docs](https://sussy-code.github.io/docs)                   | [Source Code](https://github.com/sussy-code/docs)        |
| Extension      | [extension](https://sussy-code.github.io/docs/extension)         | [Source Code](https://github.com/sussy-code/browser-ext) |
| Proxy          | [sudo-proxy](https://sudo-proxy.up.railway.app)                  | [Source Code](https://github.com/sussy-code/sudo-proxy)  |             
| Backend        | [sudo-backend](https://backend.kal-sima.lol)                    | [Source Code](https://github.com/sussy-code/backend)     |
| Frontend       | [kal-sima](https://kal-sima.lol), [2](https://flix.kanded.xyz) | [Source Code](https://github.com/sussy-code/smov)        |

**I provide these if you are not able to host yourself, though I do encourage hosting the frontend.**


## Referrers
- [Priacy Subreddit Megathread](https://www.reddit.com/r/Piracy/s/iymSloEpXn)
- [Toon's Instances](https://erynith.github.io/movie-web-instances)
- [kal-sima docs](https://sussy-code.github.io/docs)
- [kal-sima Discord](https://discord.gg/9XyDcpmnmg)
- Search Engines: DuckDuckGo, Bing, Google
- Rentry.co? (This ones a mystery)


## Running Locally
Type the following commands into your terminal / command line to run kal-sima locally
```bash
git clone https://github.com/sussy-code/smov.git
cd kal-sima
git pull
pnpm install
pnpm run dev
```
Then you can visit the local instance [here](http://localhost:5173) or, at local host on port 5173.


## Updating a kal-sima Instance
To update a kal-sima instance you can type the below commands into a terminal at the root of your project.
```bash
git remote add upstream https://github.com/sussy-code/smov.git
git fetch kal-sima  # Grab the contents of the new remote source
git checkout <YOUR_MAIN_BRANCH>  # Most likely this would be `origin/main`
git merge upstream/main
# * Fix any conflicts present during merge *
git add .  # Add all changes made during merge and conflict fixing
git commit -m "Update kal-sima instance (merge upstream/main)"
git push  # Push to YOUR repository
```


## Contact Me
**Email:** *[dev@kal-sima.lol](mailto:dev@kal-sima.lol)* 
