from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser,PermissionsMixin


class UserAccountManager(BaseUserManager):
    def create_user(self, email,name, is_admin=False,password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            is_admin=is_admin,
            
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email,name, is_admin=True, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            is_admin=is_admin,
            
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class UserAccount(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name","is_admin"]

    def get_full_name(self):
        return self.name
    
    def get_short_name(self):
        return self.name

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    
class ImageModel(models.Model):
    url = models.ImageField(upload_to="images/",height_field=None,width_field=None, max_length=100)
    caption = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    def __str__(self):
        return self.caption
        

class NextAvailableID(models.Model):
    next_id = models.IntegerField(default=1)


class Study(models.Model):
    # Fields for Study model
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='user')
    study_name = models.CharField(max_length=100)
    study_details = models.TextField()
    result_num = models.IntegerField()
    google_enabled = models.BooleanField(default=False, verbose_name='Google')
    bing_enabled = models.BooleanField(default=False, verbose_name='Bing')
    duckduckgo_enabled = models.BooleanField(default=False, verbose_name='DuckDuckGo')
    study_id = models.IntegerField(default=0)

    def __str__(self):
        return self.study_name

    def save(self, *args, **kwargs):
        # Check if it's a new Study object (not an update)
        if not self.pk:
            # Get or create the NextAvailableID instance for the user
            next_id_instance, created = NextAvailableID.objects.get_or_create()
            # Increment the next_id value and save the instance
            next_id_instance.next_id += 1
            next_id_instance.save()
            # Set the study_id field of the new Study instance
            self.study_id = next_id_instance.next_id
        super().save(*args, **kwargs)


class Query(models.Model):
    # Fields for Query model
    study = models.ForeignKey(Study, on_delete=models.CASCADE, related_name='queries')
    query_name = models.CharField(max_length=100)

    def __str__(self):
        return self.query_name

class Result(models.Model):
    # Fields for Snippet model
    # user = models.ForeignKey(UserAccount,on_delete=models.CASCADE,related_name='users')
    study = models.ForeignKey(Study, on_delete=models.CASCADE, related_name='studies')
    query = models.ForeignKey(Query, on_delete=models.CASCADE, related_name='queries')
    search_engine =  models.CharField(max_length=50)
    url = models.URLField(null=True)
    title = models.CharField(max_length=255, null=True)
    snippet = models.TextField(null=True)

    def __str__(self):
        return self.title
    
class LexiconSentimentAnalysis(models.Model):
    result = models.OneToOneField(Result, on_delete=models.CASCADE, related_name='lexicon_sentiment_analysis')
    total_sentiment_score = models.FloatField(null=True)
    normalized_sentiment_score = models.FloatField(null=True)
    sentiment_label = models.CharField(max_length=15, null=True)

    def __str__(self):
        return str(self.result)
