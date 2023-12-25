import {LocalNotifications, LocalNotificationSchema} from "@capacitor/local-notifications";

export const setNotifications = (startTime: number) => {
  LocalNotifications.checkPermissions().then(async (permStatus) => {
    if (permStatus.display === 'prompt') {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.display !== 'granted') {
      throw new Error('User denied permissions!');
    }
    const notificationsToSchedule = generateNotifications(startTime);
    await cancelDuplicates(notificationsToSchedule)

    if (notificationsToSchedule.length > 1) {
      LocalNotifications.schedule({
        notifications: notificationsToSchedule,
      }).then((result) => {
        console.log("scheduled noti", result.notifications)
      })
    }
  });

}

const generateNotifications = (startTime: number): LocalNotificationSchema[] => {

  const todaysDate = new Date();
  const idPrefix = todaysDate.toLocaleString('default', { year: '2-digit', month: '2-digit', day: '2-digit'}).replaceAll('/', '')
  const fiveHoursFifteenMinutes = 18900000
  const sevenHoursThirtyMinutes = 27000000
  const tenHoursThirtyMinutes = fiveHoursFifteenMinutes*2;
  const fiveFifteenNotification: LocalNotificationSchema = {
    title: "Depart your planes!",
    body: "4 times a day planes inside 5 minutes or else!",
    id: Number(idPrefix + '515'),
    schedule: {
      repeats: false,
      at: new Date(startTime + fiveHoursFifteenMinutes)
    }
  }
  const sevenThirtyNotification: LocalNotificationSchema = {
    title: "Depart your planes!",
    body: "3 times a day planes inside 20 minutes or else!",
    id: Number(idPrefix + '730'),
    schedule: {
      repeats: false,
      at: new Date(startTime + sevenHoursThirtyMinutes)
    }
  }
  const tenThirtyNotification: LocalNotificationSchema = {
    title: "Depart your planes!",
    body: "3 times a day planes inside 20 minutes or else!",
    id: Number(idPrefix + '103'),
    schedule: {
      repeats: false,
      at: new Date(startTime + tenHoursThirtyMinutes)
    }
  }
  return [
    fiveFifteenNotification,
    sevenThirtyNotification,
    tenThirtyNotification
  ]
}

const cancelDuplicates = async (newNotifications: LocalNotificationSchema[]) => {
  const pendingResult = await LocalNotifications.getPending()
  const notificationsToCancel: {id: number}[] = []
  const indexesToDelete: number[] = []
  for (const notification of pendingResult.notifications) {
    console.log("Pending noti", notification.id, notification.schedule?.at)
    let matchingIndex = -1
    const matchingNotification = newNotifications.find((newNotification, index) => {
      matchingIndex = index
      return newNotification.id === notification.id
    });
    if (!matchingNotification) {
      continue;
    }
    // capacitor lies and says this is a date, it is not, its a string
    const pendingDate = new Date(notification.schedule?.at as unknown as string)
    // capacitor cuts off the milliseconds on the date, do the same here
    const matchingNotificationTimeNoMillis = Math.round((matchingNotification.schedule?.at?.getTime() ?? 0)/1000)*1000
    console.log(pendingDate.getTime(), matchingNotificationTimeNoMillis)
    if (pendingDate.getTime() === matchingNotificationTimeNoMillis) {
      console.log("Matching notifications", notification.id)
      indexesToDelete.push(matchingIndex)
    } else {
      notificationsToCancel.push({id: notification.id})
    }
  }
  for (const index of indexesToDelete.reverse()) {
    newNotifications.splice(index, 1)
  }
  console.log('New notifications', newNotifications.map((noti) => noti.id + ' ' + noti.schedule?.at))
  console.log('Notification to cancel', notificationsToCancel.map((noti) => noti.id))
  if (notificationsToCancel.length > 0) {
    await LocalNotifications.cancel({notifications: notificationsToCancel})
  }
}
