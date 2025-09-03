using UnityEngine;

public class HeartEngine_v2 : MonoBehaviour
{
    // The heart
    public GameObject heartModel;

    // Audio
    public AudioSource audio_1;
    public AudioSource audio_2;

    // Beat timing settings
    public float beat_1 = 1.0f;
    public float beat_2 = 0.25f;
    private float beat_1_last;
    private float beat_2_last;


    // Timers
    private Timer beatTimer_1 = new Timer();
    private Timer beatTimer_2 = new Timer();

    // false = lub, true = dub
    private bool lubDub;
 
    public Animation modelToAnimate;
    private AnimationClip anim_LA;

    void Start()
    {
        modelToAnimate = gameObject.GetComponent<Animation>();
        anim_LA = modelToAnimate.GetClip("Heart 1, LA");
    }

    // Update is called once per frame
    void Update()
    {
        SetRates();
        //
        if(beatTimer_1.Interval() && lubDub==true){
            Debug.Log("audio 1");
            audio_1.PlayOneShot(audio_1.clip);
            beatTimer_2.Reset();
            lubDub = false;
        }
        if(beatTimer_2.Interval() && lubDub==false){
            Debug.Log("audio 2");
            audio_2.PlayOneShot(audio_2.clip);
            lubDub = true;
        }

    }

    void SetRates(){
        if(beat_1!=beat_1_last || beat_2!=beat_2_last){
            //
            beatTimer_1.SetRate(beat_1);
            beatTimer_2.SetRate(beat_2);
            // audioTimer_2.SetPhase(beat_2);
            //
            beat_1_last = beat_1;
            beat_2_last = beat_2;
        }
    }


}
