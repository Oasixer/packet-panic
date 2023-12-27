so....................

while I would love to just have a ringbuffer representing the last 100 packets, or some kind of
queue library to avoid the hassle, but either way this is insufficient...

because what we really need to do is to store the last 100 packets from each connection so that
many packets flooding from one connection don't result in other connections showing zero packets.

Okay how about we DO have a main packet queue but we also simultaneously store the last 100 or N packets from each connection.

And, on insert into the main queue, we check against the search filters of the main queue to make sure it's
not filtered out.

Then, when the search filter is changed, we will have to reevaluate the entire main queue so just delete the
entire main queue contents and then do a twitter-style heapq.merge on the last N packets from each connection.

!!!WRONG: ALSO the main packet queue technically might not need to exist outside of the DOM!
\*\*\* not sure about that part, might as well have the damn list in TS as well...
!!!!lol plus how are you gonna know what to evict?
!!!!!!!!queueHTMLComponent.lastChild ?

hmmm
