from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from .models import ImageModel,UserAccount,Study,Result,Query,NextAvailableID,LexiconSentimentAnalysis


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""

    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = UserAccount
        fields = ["email", "name"]

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = UserAccount
        fields = ["email", "password", "name", "is_active", "is_admin"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ['id',"email", "name", "is_admin",'is_active']
    list_filter = ["is_admin"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["name"]}),
        ("Permissions", {"fields": ["is_admin","is_active"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


# Now register the new UserAdmin...
admin.site.register(UserAccount, UserAdmin)

@admin.register(ImageModel)
class ImageModel(admin.ModelAdmin):
    list_display = ['id','url','caption','description']


@admin.register(Study)
class StudyAdmin(admin.ModelAdmin):
    list_display = ['id','user','study_name','study_details','result_num','google_enabled','bing_enabled','duckduckgo_enabled']

@admin.register(Query)
class QueryAdmin(admin.ModelAdmin):
    list_display = ['id','query_name','study']



@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['id','study','query','search_engine','url','title','snippet']


@admin.register(NextAvailableID)
class NextAvailableIDAdmin(admin.ModelAdmin):
    list_display = ['next_id']


from django.contrib import admin

@admin.register(LexiconSentimentAnalysis)
class LexiconSentimentAnalysisAdmin(admin.ModelAdmin):
    list_display = ['id', 'result_id', 'result__title','result__search_engine', 'total_sentiment_score', 'normalized_sentiment_score', 'sentiment_label']

    def result_id(self, obj):
        return obj.result.id

    result_id.short_description = 'Result ID'

    def result__title(self, obj):
        return obj.result.title

    result__title.short_description = 'Result Title'

    def result__search_engine(self, obj):
        return obj.result.search_engine

    result__search_engine.short_description = 'Result Search Engine'

