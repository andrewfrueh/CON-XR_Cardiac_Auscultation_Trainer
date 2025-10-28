/* ====================================================================================================

MODIFIED: added phase adjustment


	Powder Of Life
	Unity Library
	---
	Timer

	===========================

	This Timer class allows you to create simple timers. 
	A common implementation is to us an if() to check Interval(). This conditional construction allows
	you to create parallel threads -- also called protothreads, coroutines, or concurrency. This 
	allows you to lower load on the CPU by spreading out tasks at a lower clock rate. 	
	Additionally, you can use GetTimeRatio() to achieve a simple linear lerp.

	To update the timer, you must call one of the following: Interval() or Timeout()
	Interval() is for a repeating item. It calls Reset().
	Timeout() is for one-time events. It does not call Reset().

Public Properties:
	None
	
Public methods:
	Interval() -- Use for repeating events. Returns false until triggered, then returns true only once, then auto-resets to false when read.
	Timeout() -- Use for single-run (terminal) events. Returns false until triggered, then returns true until reset.
	Reset() -- Resets the timer to zero. Cycle count is maintained.
	SetRate() -- Use any unit system to set the duration of the timer. Returns nothing.
	GetRate() -- Returns the current rate of the timer.
	GetCycles() -- Returns how many cycles have passed since the timer was started.
	GetTimeElapsed() -- Returns milliseconds passed since timer started (or last reset)
	GetTimeRemaining() -- Returns milliseconds until the timer will trigger
	GetTimeRatio() -- Returns float 0-1 representing how long until the next trigger time
	GetDelta() -- Returns float representing how many seconds have passed since last frame (the actual frame rate)

	===========================

	Powder Of Life, Copyright (C) Andrew Frueh, 2018-2022
	Powder Of Life is under the GNU General Public License. See "LICENSE.txt" file included with this library.

==================================================================================================== */


using UnityEngine;

public class Timer 
{

	//
	private float lastTime;
	private float rate; 
	private int cycles;
	private float deltaTime;

	// NEW phase diff
	// private float phaseTime;

	// Constructor
    public Timer (float newRate=1f)
    {
        SetRate(newRate);
    }

	void Start () 
	{
		lastTime = GetTime();
		cycles = 0;
		//rate = 1; 
		deltaTime = 0;
	}

	public void SetRate(float newRate = 1)
	{
		rate = newRate;
		// TODO - add minute, hour, day parameters like Arduino Timer
	}

	public float GetRate()
	{
		return rate;
	}


	public int GetCycles()
	{
		return cycles;
	}


    public float GetTimeElapsed()
    {
        return Toolkit.Constrain( CalculateTimeDifference(), 0, rate ); // This will clamp to the rate and not roll over.
    }

    public float GetTimeRemaining()
    {
        return rate - GetTimeElapsed();
    }

	public float GetTimeRatio(){
		return GetTimeElapsed() / GetRate();
	}

	// ============================
	// NEW phase diff
	// public float GetPhase(){
	// 	return phaseTime;
	// }

	// public void SetPhase(float newPhase){
	// 	phaseTime = newPhase;
	// }




	public bool Interval(){
		if( CheckTime() ){
			Reset();
			return true;
		}else{
			return false;
		}
	}

	public bool Timeout(){
		if( CheckTime() ){
			// no reset for timeout
			return true;
		}else{
			return false;
		}
	}

	// NEW, phase diff
    public void Reset(){
		deltaTime = CalculateTimeDifference();
		lastTime = GetTime();
		cycles += 1;
	}

	// NEW, phase diff
	private bool CheckTime(){
		// if( deltaTime >= rate ){ // old
		if( CalculateTimeDifference() >= rate ){
			return true;
		}else{
			return false;
		}
	}


	// Delta should be the time elapse since the last frame
	public float GetDelta(){
		return deltaTime;
	}

	// Returns number of seconds
	private float CalculateTimeDifference(){
		return (GetTime() - lastTime);
	}

	// NEW, all versions need this method
	private float GetTime(){
		return Time.time;//-phaseTime;
	}


}
