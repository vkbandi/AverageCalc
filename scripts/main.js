$(document).ready(function(){
    $(".input-for-actual").change(function() {
        calculateAverage(this);
    });

    $(".input-for-expected").change(function() {
        calculateAverage(this);
    });
});

function calculateAverage(currentElement)
{
    var p1 = 0, p2 = 0, pa = 0;
    var q1 = 0, q2 = 0, qf = 0;
    var t1 = 0, t2 = 0, tf = 0;

    var actualUnitPrice = $("#actualUnitPriceInput").val();
    if(actualUnitPrice == null || actualUnitPrice == "" || isNaN(actualUnitPrice))
    {
        $("#actualUnitPriceInput").val("");
        p1 = 0;
    }
    else
    {
        p1 = parseFloat(actualUnitPrice);
    }

    var actualQuantity = parseFloat($("#actualQuantityInput").val());
    if(actualQuantity == null || actualQuantity == "" || isNaN(actualQuantity))
    {
        $("#actualQuantityInput").val("");
        q1 = 0;
    }
    else
    {
        q1 = parseFloat(actualQuantity);
    }

    //set the total actual amount
    t1 = p1 * q1;
    $("#actualTotalAmountInput").val(roundUp(t1));

    var expectedUnitPrice =  $("#expectedUnitPriceInput").val();
    if(expectedUnitPrice == null || expectedUnitPrice == "" || isNaN(expectedUnitPrice))
    {
        $("#expectedUnitPriceInput").val("");
        p2 = 0;
    }
    else
    {
        p2 = parseFloat(expectedUnitPrice);
    }

    var expectedQuantity =  $("#expectedQuantityInput").val();
    if(expectedQuantity == null || expectedQuantity == "" || isNaN(expectedQuantity))
    {
        $("#expectedQuantityInput").val("");
        q2 = 0;
    }
    else
    {
        q2 = parseFloat(expectedQuantity);
    }  

    //set the total expected amount
    t2 = p2 * q2;
    $("#expectedTotalAmountInput").val(roundUp(t2));

    //set the final quantity
    qf = q1 + q2;
    $("#expectedFinalQuantityInput").val(roundUp(qf));

    //set the final amount
    tf = t1 + t2;
    $("#expectedFinalAmountInput").val(roundUp(tf));

    //show percentage change for expected amount
    showExpectedUnitPriceChange(p1, q1, p2);

    //show percentage change for expected average amount
    showExpectedAveragePriceChange(p1, q1, q2, pa);

    showTotalChangeBasedOnExpectedPrice(p1, q1, p2);

    var expectedAveragePrice =  $("#expectedAveragePriceInput").val();
    if(expectedAveragePrice == null || expectedAveragePrice == "" || isNaN(expectedAveragePrice))
    {
        $("#expectedAveragePriceInput").val("");
        pa = 0;
    }
    else
    {
        pa = parseFloat(expectedAveragePrice);
    }
    
    if(p1 == 0 || q1 == 0)
    {
        return;
    }

    if((p2 == 0 && q2 == 0) || (q2 == 0 && pa == 0) || (pa == 0 && p2 == 0))
    {
        return;
    }
  
    if(p2 != 0 && q2 != 0 && pa != 0)
    {
        if($(currentElement).is("#expectedUnitPriceInput") && p2 != 0)
        {
            pa = 0;
        }    
        else if($(currentElement).is("#expectedQuantityInput") && q2 != 0)
        {
            pa = 0;
        }
        else if($(currentElement).is("#expectedAveragePriceInput") && pa != 0)
        {
            q2 = 0;
        }
        else
        {
            pa = 0;
        }
    }

    if(p1 != 0 && q1 != 0 && p2 == pa)
    {
        alert("Cannot have same values for 'Price (expected)' and 'Average price (final)'");
        return;
    }

    if(p1 < 0 || p2 < 0 || pa < 0)
    {
        alert("Price cannot be negative, quantity can be negative");
    }

    if(p2 == 0)
    {
        p2 = calculateExpectedPrice(p1, q1, q2, pa);
        $("#expectedUnitPriceInput").val(roundUp(p2));
    }

    if(q2 == 0)
    {
        q2 = calculateExpectedQuantity(p1, q1, p2, pa);
        $("#expectedQuantityInput").val(roundUp(q2));
    }

    if(pa == 0)
    {
        pa = calculateExpectedAveragePrice(p1, q1, p2, q2);
        $("#expectedAveragePriceInput").val(roundUp(pa));
    }

    //set the total expected amount
    t2 = p2 * q2;
    $("#expectedTotalAmountInput").val(roundUp(t2));

    //set the final quantity
    qf = q1 + q2;
    $("#expectedFinalQuantityInput").val(roundUp(qf));

    //set the final amount
    tf = t1 + t2;
    $("#expectedFinalAmountInput").val(roundUp(tf));

    showExpectedUnitPriceChange(p1, q1, p2);
    showExpectedAveragePriceChange(p1, q1, q2, pa);
    showTotalChangeBasedOnExpectedPrice(p1, q1, p2);
}

function roundUp(targetNumber, decimalPoints)
{
    if(decimalPoints == null || decimalPoints == "" || isNaN(decimalPoints))
    {
        decimalPoints = 2;
    }

    var catalyst = Math.pow(10, decimalPoints);
    return  Math.ceil(targetNumber * catalyst)/catalyst;
}

function calculateExpectedPrice(p1, q1, q2, pa)
{
    return (((pa * q1) - (p1 * q1))/ q2) + pa;
}

function calculateExpectedQuantity(p1, q1, p2, pa)
{
    if((pa - p2) == 0)
    {
        return 0;
    }
    else
    {
        return ((p1 * q1) - (pa * q1))/ (pa -p2);
    }
    
}

function calculateExpectedAveragePrice(p1, q1, p2, q2)
{
    var totalQuantity = q1 + q2;
    if(totalQuantity == 0)
    {
        return 0;
    }
    else
    {
        return ((p1 * q1) + (p2 * q2))/ totalQuantity;
    }
}

function showExpectedUnitPriceChange(p1, q1, p2)
{
    if(p1 == 0 || p2 == 0)
    {
        return;
    }

    var priceChange = ((p2 - p1)/p1) * 100;

    if(q1 > 0)
    {
        showValueChange("#expectedUnitPriceChange", priceChange, "value-change-green", "value-change-red");
    }
    else
    {
        showValueChange("#expectedUnitPriceChange", priceChange, "value-change-red", "value-change-green");
    }
}

function showExpectedAveragePriceChange(p1, q1, q2, pa)
{
    if(p1 == 0 || pa == 0)
    {
        return;
    }
    
    var priceChange = ((pa - p1)/p1) * 100;

    var totalQuantity = q1 + q2;
    if(totalQuantity > 0)
    {
        showValueChange("#expectedAveragePriceChange", priceChange, "value-change-red", "value-change-green");
    }
    else
    {
        showValueChange("#expectedAveragePriceChange", priceChange, "value-change-green", "value-change-red");
    }
}

function showTotalChangeBasedOnExpectedPrice(p1, q1, p2)
{
    if(p1 == 0 || p2 == 0 || q1 == 0)
    {
        return;
    }

    var totalChange = ((p2 * q1) - (p1 * q1));
    showValueChange("#actualTotalPriceExpectedChange", totalChange, "value-change-green", "value-change-red");
}

function showValueChange(targetElementSelector, actualValue, positiveCssClass, negativeCssClass)
{
    var targetElement = $(targetElementSelector);
    targetElement.removeClass(positiveCssClass);
    targetElement.removeClass(negativeCssClass);

    if(!isFinite(actualValue))
    {
        return;
    }

    if(actualValue > 0)
    {
        targetElement.addClass(positiveCssClass);
    }
    else if(actualValue < 0)
    {
        targetElement.addClass(negativeCssClass);
    }

    var actualValueRoundedUp = roundUp(actualValue);
    if(actualValueRoundedUp > 0)
    {
        targetElement.text("+" + actualValueRoundedUp);
    }
    else
    {
        targetElement.text(actualValueRoundedUp);
    } 
}
