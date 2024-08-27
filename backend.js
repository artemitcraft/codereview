const validateBookingOnExistInMultipleSlots = function (
  activity_unique_id,
  startDate,
  endDate,
  number_of_slots,
  slots_activities_id,
  allPossibleActivities,
  callBackValidation,
  environment = 'mobile',
) {
  var userBookingActivities = slots_activities_id.slice();
  userBookingActivities.push(activity_unique_id);
  async.parallel(
    {
      getAllBookingsForThisDay: function (cb) {
        BookingService.validateBooking(
          allPossibleActivities,
          activity_unique_id,
          endDate,
          startDate,
          function (err, result) {
            if (err) {
              return cb(err, null);
            } else {
              var resultObj = null;
              if (result.length > 0) {
                resultObj = result;
              }
              return cb(null, resultObj);
            }
          },
        );
      },
    },
    function (err, results) {
      if (err) {
        return callBackValidation(err, null);
      } else {
        if (!results.getAllBookingsForThisDay) return callBackValidation(null, {status: true});
        else {
          var receivedActivities = _.map(results.getAllBookingsForThisDay, function (ob) {
            return {
              slots_activities_id: ob.slots_activities_id
                ? ob.slots_activities_id.concat(ob.activity_unique_id)
                : [ob.activity_unique_id],
            };
          });

          var check = [];

          receivedActivities.forEach(function (item) {
            var result = _.intersection(userBookingActivities, item.slots_activities_id);
            if (
              (!result.length && !receivedActivities.length) ||
              (result.length == userBookingActivities.length && result.length == item.slots_activities_id.length)
            )
              return check.push(true);
            else return check.push(false);
          });

          if (check.indexOf(false) == -1) return callBackValidation(null, {status: true});
          else return callBackValidation(null, {status: false});
        }
      }
    },
  );
};
