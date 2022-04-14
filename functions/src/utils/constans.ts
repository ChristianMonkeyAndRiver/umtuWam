enum Products {
    Chats = 'Chats',
    Photos = 'Photos',
    Verified = 'Verified',
}

enum PaymentState {
    Created = 'CREATED',
    Accepted = 'ACCPETED',
}

enum ErrorMessages {
    ErrorText = 'Error:',
    NoUserError = 'No user found',
    NoDatesMessage = 'No dates found',
    PaymentFailureError = 'Payment failed',
    NoMessageFoundError = 'No messages found',
    SubscritionNotFound = 'Subscrition not found',
    IncorrectProductId = 'Incorrect product ID used',
    UnexpectedExrror = 'An unexpected error occurred',
    TooManyimagesError = 'Max upload limit has been reached',
}

enum SuccessMessages {
    PaymentSuccess = 'Payment was successful',
    NoDatesMessage = 'No potential dates found',
    SuccessMessage = 'Function successfully executed',
    UserSuccessfulUpdate = 'User successfully updated',
    UserPreferencesSuccessfulUpdate = 'User preferences successfully updated',
}

enum FunctionsConstants {
    Bio = 'bio',
    Uid = 'uid',
    Age = 'age',
    Binu = 'biNu',
    Moya = 'Moya',
    Send = 'send',
    Name = 'name',
    AgeMin = 'ageMin',
    AgeMax = 'ageMax',
    Chats = 'chats',
    About = 'About',
    Share = 'share',
    Rate = 'rate',
    Likes = 'likes',
    Users = 'users',
    Usage = 'usage',
    Xbinu = 'x-binu',
    Gender = 'gender',
    Profile = 'Profile',
    Content = 'content',
    Product = 'product',
    Messages = 'messages',
    Chatting = 'Chatting',
    Location = 'location',
    UmtuWam = 'UmuntuWam',
    RateMoya = 'Rate Moya',
    ProductId = 'productId',
    Timestamp = 'timestamp',
    ShareMoya = 'Share Moya',
    SpaceParsedValue = '%20',
    Membership = 'Membership',
    LookingFor = 'lookingFor',
    Preferences = 'preferences',
    ExpiryDate = 'expiryDate',
    PhoneNumber = 'phoneNumber',
    Subscriptions = 'subscriptions',
    Verified = 'Verified profile',
    SeeAllPhotos = 'See All Photos',
    MoyaSubjectText = 'Moya #datafree app',
    ClickToPayChats = 'Click to pay R1 to chat for a day',
    ClickToPayPhotos = 'Click to pay R1 to see all profile photos',
    ClickToPayVerified = 'Click to pay R1 to show a VERIFIED badge on your profile',
    DefualtImage = 'https://firebasestorage.googleapis.com/v0/b/umtuwam.appspot.com/o/logos%2Fprofile_logo.png?alt=media&token=8163c425-06f0-485f-9e35-dde862ce0c53',
    MoyaShareText = 'Check out the Moya #datafree super-app! I use it for #datafree chat and many other services. Even better, it works when you have no airtime or data balance. Get it from https://moya.app/dl/',
    PaymentId = 'paymentId',
}

export {
    Products,
    PaymentState,
    ErrorMessages,
    SuccessMessages,
    FunctionsConstants,
};
