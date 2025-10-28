using System;
using TMPro;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.UI;

public class HeartEngine_v1 : MonoBehaviour
{

    public SkinnedMeshRenderer heartModel;
    
    public string rightAtriumName;
    public string leftAtriumName;
    public string rightVentricleName;
    public string leftVentricleName;

    private int RA_Index;
    private int LA_Index;
    private int RV_Index;
    private int LV_Index;

    public AudioSource audio_1;
    public AudioSource audio_2;

    public float beat_1 = 1.0f;
    public float beat_2 = 0.25f;
    private float beat_1_last;
    private float beat_2_last;


    private Timer beatTimer_1 = new Timer();
    private Timer beatTimer_2 = new Timer();

    // starting over

    // Primary beat is the main pulse, the "lub" or atrial contraction
    // private Timer primaryBeat = new Timer();
    // // Secondary beat is "dub" or ventrical contraction
    // private Timer secondaryBeat = new Timer();

    // false = lub, true = dub
    private bool lubDub;

    public float curveExponent = 2f;

    public Slider heartRateSlider;

    public TMP_Text heartRateDisplay;

    
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        RA_Index = heartModel.sharedMesh.GetBlendShapeIndex(rightAtriumName);
        LA_Index = heartModel.sharedMesh.GetBlendShapeIndex(leftAtriumName);
        RV_Index = heartModel.sharedMesh.GetBlendShapeIndex(rightVentricleName);
        LV_Index = heartModel.sharedMesh.GetBlendShapeIndex(leftVentricleName);
    }

    // Update is called once per frame
    void Update()
    {
        SetRates();

        SetBlendshapes();

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
            // beatTimer_1.SetRate(beat_1);
            beatTimer_1.SetRate(heartRateSlider.value);
            beatTimer_2.SetRate(beat_2);
            //
            // beat_1_last = beat_1;
            beat_1_last = heartRateSlider.value;
            beat_2_last = beat_2;
            // Update UI display
            heartRateDisplay.text = ((int)(60 / heartRateSlider.value)).ToString();
            // heartRateDisplay.text = ((int)Toolkit.Map(heartRateSlider.value,0.25f,2.0f,30f,240f)).ToString();
        }
    }

    void SetBlendshapes(){
        // heartModel.SetBlendShapeWeight( RA_Index, CalcBlendAmount(audioTimer_1) );
        heartModel.SetBlendShapeWeight( RA_Index, CalcBlendAmount(beatTimer_1, false) );
        heartModel.SetBlendShapeWeight( LA_Index, CalcBlendAmount(beatTimer_1, false) );
        heartModel.SetBlendShapeWeight( RV_Index, CalcBlendAmount(beatTimer_1, true) );
        heartModel.SetBlendShapeWeight( LV_Index, CalcBlendAmount(beatTimer_1, true) );
    }

    float CalcBlendAmount(Timer calcTimer, bool phased){
        float output;
        float offset;
        if(phased){
            offset = beat_2;
        }else{
            offset = 0;
        }
        // Calculate the "ratio" manually so we can insert the offset
        //  output is from offset to 1 + offset
        // output = ((calcTimer.GetTimeRemaining()+offset)/calcTimer.GetRate());

        // Get the current ratio
        output = 1-calcTimer.GetTimeRatio();


        output = output + (offset/calcTimer.GetRate());

        // Then modulo over 1
        output = output % 1.0f;

        // curve
        output = Bathtub( output, curveExponent );

        // Invert?
        // output = 1 - output;

        // Then multiply by 100 (shape keys are 0-100)
        output = output * 100;
        return output;
    }

    private float Bell(float x, float e) {
        return (float)((Math.Pow(Math.Sin(x*Math.PI), e)/2) * 2);
    }

    public float Bathtub(float x, float e) {
        return (float)Math.Pow( (Math.Abs(x - 0.5) * 2), e );
    }




}
