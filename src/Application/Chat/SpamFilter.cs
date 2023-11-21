public class SpamFilter {
    private const int N = 5;            // n times 
    private const int mt = 1000;        // in t milliseconds
    private LinkedList<MsgTime> msgs = new LinkedList<MsgTime>();

    class MsgTime {
        private string msg;
        private DateTime dt;

        public MsgTime (string m, DateTime dt) {               // constructor
            msg = m;
            this.dt = dt;
        }

        public string Msg { get => msg; set => msg = value; }  // getter/setter
        public DateTime Dt { get => dt; set => dt = value; }
    }

    public bool IsSpam(string msg) {                        // t초 내에 같은 문자열 n번 입력 시 도배
        int nConsec = 0;

        msgs.AddLast(new MsgTime(msg, DateTime.Now));
        if (msgs.Count() == N) {                            // if n times: N times same string?
            foreach (MsgTime m in msgs) {
                if ( m.Msg.Equals(msgs.First.Value.Msg) )
                    nConsec++;
                Console.WriteLine(m.Msg + ", " + "consec: " + nConsec);
            }
            msgs.RemoveFirst();
        }

        int interval = (msgs.Last.Value.Dt - msgs.First.Value.Dt).Seconds * 1000 
                        + (msgs.Last.Value.Dt - msgs.First.Value.Dt).Milliseconds;
        Console.WriteLine("interval time: " + interval / 1000.0);

        if (nConsec == N && interval < mt) {               // if n times same string // in t seconds                            
            return true;                                   // spam
        }
        
        return false;
    }
}
