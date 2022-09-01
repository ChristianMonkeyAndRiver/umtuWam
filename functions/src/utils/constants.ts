enum Products {
    ChatsAndPhotos = 'ChatsAndPhotos',
    Verified = 'Verified',
    Boost = 'Boost',
}

enum Prices {
    ChatsAndPhotos = 3000,
    Verified = 500,
    Boost = 1000,
}

enum PaymentState {
    Created = 'CREATED',
    Accepted = 'ACCEPTED',
    Approved = 'APPROVED',
}

enum ErrorMessages {
    ErrorText = 'Error:',
    NoUserError = 'No user found',
    NoDatesMessage = 'No dates found',
    PaymentFailureError = 'Payment failed',
    NoMessageFoundError = 'No messages found',
    SubscriptionNotFound = 'Subscrition not found',
    IncorrectProductId = 'Incorrect product ID used',
    UnexpectedError = 'An unexpected error occurred',
    TooManyImagesError = 'Max upload limit has been reached',
}

enum SuccessMessages {
    PaymentSuccess = 'Payment was successful',
    NoDatesMessage = 'No potential dates found',
    SuccessMessage = 'Function successfully executed',
    UserSuccessfulUpdate = 'User successfully updated',
    UserPreferencesSuccessfulUpdate = 'User preferences successfully updated',
}

enum Events {
    Liked = 'Liked',
    Message = 'Message',
    Subscription = 'Subscription',
}

enum FunctionsConstants {
    Bio = 'bio',
    Uid = 'uid',
    Id = 'id',
    Age = 'age',
    Binu = 'biNu',
    Moya = 'Moya',
    Send = 'send',
    Name = 'name',
    Home = 'Home',
    Next = 'Next',
    AgeMin = 'ageMin',
    AgeMax = 'ageMax',
    Chats = 'chats',
    About = 'About',
    Share = 'share',
    Rate = 'rate',
    Likes = 'likes',
    Users = 'users',
    Notifications = 'notifications',
    AdminData = 'admin_data',
    AdminTracker = 'admin_trackers',
    Reports = 'reports',
    Usage = 'usage',
    Xbinu = 'x-binu',
    Gender = 'gender',
    GenderPreference = 'genderPreference',
    Points = 'points',
    Profile = 'Profile',
    Content = 'content',
    Product = 'product',
    Messages = 'messages',
    ChatsAndPhotos = 'Chats and Photos',
    Boost = 'Boost',
    Location = 'location',
    UmtuWam = 'UmtuWam',
    RateMoya = 'Rate Moya',
    ProductId = 'productId',
    IsBanned = 'isBanned',
    Timestamp = 'timestamp',
    ShareMoya = 'Share Moya',
    SpaceParsedValue = '%20',
    Membership = 'Membership',
    LookingFor = 'lookingFor',
    Preferences = 'preferences',
    PreferencesCapital = 'Preferences',
    ExpiryDate = 'expiryDate',
    PhoneNumber = 'phoneNumber',
    Subscriptions = 'subscriptions',
    Verified = 'Verified profile',
    SeeAllPhotos = 'See All Photos',
    MoyaSubjectText = 'Moya #datafree app',
    ClickToPayChatsAndPhotos = 'Click to pay R30 to chat and view photos for a month',
    ClickToPayChatsMonth = 'Click to pay R15 to chat for a month',
    ClickToPayPhotos = 'Click to pay R1 to see all profile photos',
    ClickToPayFeatured = 'Click to pay R10 to have your profile boosted for a day',
    ClickToPayVerified = 'Click to pay R5 to show a VERIFIED badge on your profile',
    NextImage = 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fnext_button%20(2).png?alt=media&token=5b91d688-b483-4725-8e8b-d932583dc166',
    DefaultImage = 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
    MoyaShareText = 'Check out the Moya #datafree super-app! I use it for #datafree chat and many other services. Even better, it works when you have no airtime or data balance. Get it from https://moya.app/dl/',
    PaymentId = 'paymentId',
}

export { Products, Prices, PaymentState, ErrorMessages, SuccessMessages, FunctionsConstants, Events };
