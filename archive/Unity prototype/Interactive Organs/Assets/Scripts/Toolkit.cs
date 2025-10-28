/* ====================================================================================================

	Powder Of Life
	Unity Library
	---
	Toolkit

	===========================

    These are handy functions I got used to having in other environments. 

	===========================

	Powder Of Life, Copyright (C) Andrew Frueh, 2018-2022
	Powder Of Life is under the GNU General Public License. See "LICENSE.txt" file included with this library.

==================================================================================================== */

using UnityEngine;

public static class Toolkit
{
    
    // Translated from Arduino
    public static float Map(float x, float in_min, float in_max, float out_min, float out_max)
    {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    // Translated from Arduino
    public static float Constrain(float x, float min, float max)
    {
        return (x > min) ? ((x < max) ? x : max) : min;
    }

    public static int getSign( float input ) {
        if ( input < 0 ) return -1;
        if ( input > 0 ) return 1;
        return 0;
    }

    
}
